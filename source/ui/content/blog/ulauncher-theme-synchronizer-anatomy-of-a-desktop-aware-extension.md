---
author: Klaudio Sinani
pubDatetime: 2026-08-07T09:30:00Z
modDatetime:
title: "Ulauncher Theme Synchronizer: Anatomy of a Desktop Aware Extension"
slug: ulauncher-theme-synchronizer-anatomy-of-a-desktop-aware-extension
featured: false
draft: false
tags:
  - ulauncher
  - gnome
  - python
  - linux
  - extension
seoTitle: "Ulauncher Theme Synchronizer: Anatomy of an Extension"
description: "How the operating system, the desktop and the launcher work together, and how a Ulauncher extension follows the GNOME light and dark theme."
---

_How the operating system, the desktop and the launcher work together._

## Purpose

The main purpose of this publication is to examine the design of
[Ulauncher Theme Synchronizer](https://github.com/klaudiosinani/ulauncher-theme-synchronizer). The extension keeps the
appearance of Ulauncher the same as the appearance of the desktop.

The requirement is short. When the desktop changes to dark, the launcher must change to dark. The implementation is
longer, because the appearance is not one setting in one place. It is a GNOME setting, a Ulauncher setting, and
nothing at all at the level below them.

What follows is the parts of the system that hold those settings, and the code that connects them. Some of the
problems that came with it are here too.

## Index

- [Purpose](#purpose)
- [Introduction](#introduction)
- [Where The Appearance Lives](#where-the-appearance-lives)
  - [Nothing In The Kernel](#nothing-in-the-kernel)
  - [GSettings](#gsettings)
  - [The Main Loop Condition](#the-main-loop-condition)
- [The Launcher Side](#the-launcher-side)
  - [Extensions](#extensions)
  - [Themes](#themes)
- [The Gap](#the-gap)
- [Detection](#detection)
- [Watching For Changes](#watching-for-changes)
- [Resolving And Applying](#resolving-and-applying)
- [The Full Cycle](#the-full-cycle)
- [The Atomic Write](#the-atomic-write)
- [Restarting Your Own Parent](#restarting-your-own-parent)
- [The Guard](#the-guard)
- [Constraints](#constraints)
- [Conclusion](#conclusion)
- [Resources](#resources)

## Introduction

[Ulauncher](https://ulauncher.io) is an application launcher for Linux. You press a key combination, type a few
characters, and the application that you want starts.

GNOME lets you select a light or a dark appearance for the desktop. Ulauncher does not use that setting. It keeps the
theme from its own preferences. On a dark desktop the launcher can open as a bright white panel. That is the reason
for the extension.

The extension does three things: it reads the appearance of the desktop, it finds the theme that the user mapped to
that appearance, and it applies the theme. The remainder of this publication is about what each of those steps
involves.

## Where The Appearance Lives

### Nothing In The Kernel

The operating system, in the strict sense, has no concept of light and dark.

The Linux kernel controls processes, memory, file systems and devices. There is no system call for the color scheme,
and no kernel event when it changes. What we call "the appearance of the operating system" is a user space convention:
a value in an agreed location that applications can read.

There is nothing below the desktop environment to query. The value that GNOME publishes is the only value available.

### GSettings

Under GNOME the value is in **GSettings**. Schemas declare the keys and their types. The system compiles them and
installs them for all users, so an application can read a key that it did not declare. The **dconf** backend keeps the
values. The API gives you one object with typed getters, typed setters and change notifications.

The key is `color-scheme` in the `org.gnome.desktop.interface` schema, added in GNOME `42`. Three values are standard:
`default`, `prefer-light` and `prefer-dark`. You can also set the key from a terminal:

```bash
gsettings set org.gnome.desktop.interface color-scheme prefer-dark
```

A `Gio.Settings` object sends a `changed` signal when a program in the session modifies one of its keys. The detailed
syntax `changed::<key>` limits the subscription to one key.

### The Main Loop Condition

GLib sends its signals from a main loop, and this condition is easy to miss. To connect a callback does nothing on its
own. A `GLib.MainLoop` must run and process the events. If a process connects a handler and then does other work, the
signal never occurs.

## The Launcher Side

### Extensions

Under API version `2` an extension is not a plugin inside the launcher. It is a separate Python process. Ulauncher
starts that process and communicates with it over a socket.

Two consequences follow. The extension has its own threads, so it can run a main loop and the launcher interface does
not stop. The extension is also a child of Ulauncher, so it stops when Ulauncher stops.

Three events are important. `PreferencesEvent` arrives one time at start-up with the configured values.
`SystemExitEvent` is where the extension stops that work again. `KeywordQueryEvent` occurs when the user types the
extension keyword, and it controls the status view.

### Themes

A theme is a directory of CSS files. Ulauncher records the name of the selected theme in the launcher settings:

```bash
cat ~/.config/ulauncher/settings.json | grep theme-name
```

```plaintext
"theme-name": "dark",
```

Ulauncher owns that file. It reads the file at start-up, and writes it again when a preference changes in its own
interface. The theme goes into the style context during initialization. There is no supported mechanism to make a
running Ulauncher load a different one.

## The Gap

The problem, stated accurately:

1. The operating system holds no appearance value.
2. GNOME holds the preference that the session obeys, and announces each change, but only to the listeners that run a
   GLib main loop.
3. Ulauncher holds a separate value in its own file, reads it one time at start-up, and offers no way to read it
   again.

The extension must listen on the terms of GNOME. It must translate into the terms of Ulauncher, and write the result
into a file that it does not own. Then it must apply that result, and Ulauncher supplies no mechanism to apply it.

## Detection

The two GNOME strings occur in one place. The extension changes the value into an enumeration immediately:

```python
class ModeParser:
    def parse(self, mode: str) -> Mode:
        formatted_mode = mode.lower()

        if DARK_KEYWORD in formatted_mode:
            return Mode.DARK

        return Mode.LIGHT
```

The substring test is a compromise. The set of values of `color-scheme` is not closed. Distributions patch it, and
derivative desktops use the key with values of their own. An exhaustive match gives a wrong answer for each value that
it does not know. A test for `dark` gives the correct answer for each value that contains that word.

## Watching For Changes

Detection gives an answer when the extension asks for one. To react without a request, the extension must run that
main loop. Its main thread is already blocked on the socket to Ulauncher, so the loop gets a thread of its own:

```python
    def start(self) -> None:
        with self._lock:
            if self._is_started:
                logger.debug("Operating System mode watcher already started")
                return

            self._handler_id = self._gio_settings.connect(f"changed::{self._key}", self._mode_event_handler.handle)

            self._glib_loop = GLib.MainLoop()
            self._thread = threading.Thread(target=self._execute_loop, daemon=True)
            self._thread.start()
            self._is_started = True
```

The thread is a daemon, so it cannot keep the process alive after shutdown. The code keeps the handler identifier from
`connect`, because the subscription needs it to cancel. The lock and the `_is_started` flag are there for two
reasons. Ulauncher does not promise to deliver a lifecycle event one time only, and `start` and `stop` arrive on a
different thread from the loop.

Both lifecycle listeners are three lines:

```python
class PreferencesEventListener(EventListener):
    def on_event(self, event: BaseEvent, extension: Extension) -> None:
        self._operating_system_mode_watcher.start()
```

The handler reads the key again, and does not use the data from the event. A `changed` signal tells you that a key
changed. It does not tell you the new value.

## Resolving And Applying

The mapping of the user is in the extension preferences. The values of the enumeration are the preference identifiers
from the manifest:

```python
class Theme(Enum):
    DARK = "dark_theme"
    LIGHT = "light_theme"
```

so the resolution is a lookup with a guard:

```python
    def resolve(self, mode: Mode) -> str:
        theme = self._theme_parser.parse(mode)
        preferences: dict[str, str] = self._extension.preferences

        if theme.value not in preferences:
            raise KeyError(f"Preference '{theme.value}' not found in extension preferences")

        return preferences[theme.value]
```

`Mode` is what GNOME reported, `Theme` is which preference answers it, and the string that comes back goes to
Ulauncher. The code reads the preference at each resolution and keeps no copy, so a user can edit the mapping without
a restart.

To apply the theme, the extension must operate on a process that it does not own:

```python
    def activate_theme(self, theme: str) -> None:
        if self._is_theme_already_active(theme):
            logger.info("Ulauncher theme already active: %s", theme)
            return

        self._ulauncher_settings_service.persist_theme(theme)

        if not self._ulauncher_process_service.restart():
            logger.warning("Persisted Ulauncher theme but failed to restart: %s", theme)
            return

        logger.info("Activated Ulauncher theme: %s", theme)
```

The method does three things: a guard, a write, and a restart. The warning covers the condition where the theme is on
disk but the restart failed. The change then takes effect at the next mode change, and it is not lost.

## The Full Cycle

The user mapped light to `adwaita` and dark to `ubuntu`. The desktop is light, and the user now changes the appearance
switch.

1. GNOME writes `prefer-dark` into `color-scheme`, and dconf keeps the value.
2. GSettings sends `changed` to each subscriber in the session.
3. The dedicated `GLib.MainLoop` thread receives it, because it matches the `changed::color-scheme` subscription from
   start-up.
4. The handler reads the key again, gets `prefer-dark`, and `ModeParser` normalizes it to `Mode.DARK`.
5. `Mode.DARK` maps to `Theme.DARK`, whose value is `dark_theme`.
6. A lookup of that identifier in the extension preferences gives `ubuntu`.
7. The `theme-name` value on disk is `adwaita`, so the operation continues.
8. The extension loads the settings document, sets `theme-name` to `ubuntu`, and writes it back atomically.
9. A detached Ulauncher starts with a delay of one second. The extension sends `SIGTERM` to the process that runs, and
   the replacement loads `ubuntu` from disk.

Use `inv dev --file-log` to write the log to a file. The second half of the cycle is then visible:

```plaintext
2026-08-07 09:31:47,904 | DEBUG | ...mode.mode_event_handler: handle() | Detected Operating System mode change: dark
2026-08-07 09:31:47,912 | INFO  | ...launcher.ulauncher_process_service: restart() | Restarting Ulauncher: previous pids={12048}, new pid=31517
2026-08-07 09:31:47,913 | INFO  | ...launcher.ulauncher_service: activate_theme() | Activated Ulauncher theme: ubuntu
```

## The Atomic Write

The extension never writes the settings file directly. It writes the content to a temporary file in the same
directory. It flushes the data, calls `fsync`, and then `os.replace` moves the file to the correct path:

```python
    def write(self, path: Path, content: str, encoding: str = "utf-8") -> None:
        temporary_file_path: str | None = None

        try:
            with tempfile.NamedTemporaryFile(
                mode="w", encoding=encoding, dir=path.parent, delete=False, suffix=".tmp"
            ) as temporary_file:
                temporary_file.write(content)
                temporary_file.flush()
                os.fsync(temporary_file.fileno())
                temporary_file_path = temporary_file.name

            os.replace(temporary_file_path, path)

        except Exception:
            if temporary_file_path is not None:
                with suppress(OSError):
                    os.unlink(temporary_file_path)

            raise
```

The same directory is necessary, because `os.replace` is atomic only in one file system. If a step fails, the code
deletes the temporary file and then raises the exception again. A write that fails leaves no `.tmp` files.

This is more care than the extension needs for itself. The file belongs to Ulauncher, and a partial `settings.json`
gives the user a launcher that cannot start.

## Restarting Your Own Parent

The extension is a child process of Ulauncher. To restart Ulauncher, it must stop its own parent and then start that
parent again. A simple "stop, then start" does not work, because no process continues to do the second step.

The new process starts first:

```python
    def restart(self) -> bool:
        try:
            pids = self.retrieve_pids()
            new_pid = self.start()
            logger.info("Restarting Ulauncher: previous pids=%s, new pid=%s", pids, new_pid)
            self.stop(pids)
            return True

        except Exception as exc:
            logger.exception("Failed to restart Ulauncher: %s", exc)
            return False
```

- `start_new_session=True` puts the replacement in its own session and process group, so the `SIGTERM` does not stop
  it.
- The command is `sleep 1 && ulauncher --hide-window`. The `--hide-window` option keeps the launcher invisible.
  Ulauncher is a single-instance application and holds a DBus name, and without the delay the replacement starts
  before the name is free and then exits.
- The extension sends `SIGTERM` and not `SIGKILL`.

The `try/except` block returns a boolean and does not let the exception continue. That is deliberate here. The code
runs on the GLib loop thread, and an exception that continues stops the loop. Every later notification needs that
loop. `activate_theme` changes the `False` into a warning.

## The Guard

`_is_theme_already_active` looks like an optimization. It is mostly there because a `changed` signal does not mean a
different value. A write of the same value is still a write, and each one would otherwise cost a full launcher
restart. If a user maps both modes to the same theme, each change restarts the application that the user looks at.

## Constraints

- The extension supports GNOME only. It listens to `color-scheme` and to nothing else. One class contains the key, so a
  second source would be an addition and not a rewrite.
- A theme change costs a restart. Ulauncher supplies no other mechanism.
- The restart uses external commands to find the process, and a constant delay of one second. This is satisfactory on
  a usual desktop, but it is not guaranteed.
- The state is in a file of another application.

## Conclusion

The theme change is not the interesting part. To map a boolean to one of two strings is not a difficult problem.

The interesting part is that different people built the three layers at different times, with no expectation that
they would have to cooperate. GNOME publishes continuously, but only to the processes that run a main loop. Ulauncher
reads its theme one time and never again. The kernel is not involved at all.

Most of the code connects those layers and does not do the work. A thread for the loop. An atomic write, because the
file has another owner. A restart, because there is no reload. A guard, because the restart is expensive.

This is usual for desktop integration work.

## Resources

- **GitHub Repository**: [github.com/klaudiosinani/ulauncher-theme-synchronizer](https://github.com/klaudiosinani/ulauncher-theme-synchronizer)
- **Ulauncher Extension API**: [docs.ulauncher.io/en/stable/extensions/intro.html](https://docs.ulauncher.io/en/stable/extensions/intro.html)
- **GSettings Reference**: [docs.gtk.org/gio/class.Settings.html](https://docs.gtk.org/gio/class.Settings.html)
- **GLib Main Loop Reference**: [docs.gtk.org/glib/main-loop.html](https://docs.gtk.org/glib/main-loop.html)
