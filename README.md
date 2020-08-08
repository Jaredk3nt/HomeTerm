# HomeTerm

A homepage disguised as a toy terminal!

![HomeTerm](/media/HomeTerm.png)

- Dynamic prompt to interact with bookmarks
- Built in Google search
- Multiple themes with command for switching easily
- Command history for repeating commands easily
- Stores bookmarks on your machine so they persist past your session

## Available Commands

Here are the currently available commands that can be run on the terminal.

| Command  | usage                             | description                                                                                                                                                                          |
| -------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ls`     | `ls [<path to dir>]`              | List children of current working directory or given directory.                                                                                                                       |
| `tree`   | `tree [<path to dir>]`            | Lists all children of current working directory or given directory in tree format                                                                                                    |
| `cd`     | `cd [<path>]`                     | Move into given directory. If no path given move to root.                                                                                                                            |
| `open`   | `open <path to link>`             | Open a link in a new tab.                                                                                                                                                            |
| `touch`  | `touch <path to link> <url>`      | Create a new link                                                                                                                                                                    |
| `mkdir`  | `mkdir <path to dir>`             | Create a new directory                                                                                                                                                               |
| `rm`     | `rm <path to link>`               | Delete link                                                                                                                                                                          |
| `rmdir`  | `rmdir <path to dir>`             | Delete dir and all contents                                                                                                                                                          |
| `search` | `search [-e] ["<search string>"]` | Search with given search string (Must be in quotes to capture multiple words). Supply `-e` with a search URL or pre-defined engine (`ddg`, `google`, `bing`) to change search engine |
| `clear`  | `clear`                           | Clear the terminal of past commands.                                                                                                                                                 |
| `theme`  | `theme [<theme name>]`            | Change theme.                                                                                                                                                                        |
| `mv`     | `mv <source path> <target path>`  | "Move" file or directory. Allows for renaming/moving resources within the file tree.                                                                                                 |
| `edit`   | `edit <link path> <url>`          | Change the URL value for a given link.                                                                                                                                               |
| `help`   | `help [<command>]`                | Get information on commands.                                                                                                                                                         |

## Theming

![Terminal Themes](/media/theming.png)

TermForm supports custom terminal themeing and some cool built-in themes.

- Dark & Light Default
- Grey scale Dark
- LaserWave
- Nord
- Dracula

The theming for the site is done through css variables.
To add your own theme just:

- add a new class for your `<body>` with the name you want your theme to be called
- add all of the existing variables with your theme values. (Theme variable defaults can be found under the :root definition)
- add the class name to the `THEMES` array in `src/cli.js` so the terminal knows about it

You should now be able to switch to your theme using the terminal!

> Feel free to submit PRs or open issues to get _popular_ themes added to this project!

## Fixing issues

Your TermPage file structure is stored in your browsers LocalStorage, if you encounter any bugs you can solve them by either modifying _(open an issue for help)_ or deleting your LocalStorage. **Please submit isses for any bugs you find!**

## Roadmap

### Features

- ~~`edit` command for changing urls~~
- ~~`mv` to rename dir and link names~~
- `export` and `import` for sharing your file structure with other machines
- ~~Tree view for `ls`, and url view for `ls`~~
- ~~Add flags for search to change search engine~~
- Tab complete for commands and paths

### Themes

- ~~NightOwl~~
