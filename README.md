# TheScriptSite

A Roblox scripts hub using the ScriptBlox API, with a cool GUI, hover effects, script creation, downloads, tutorials, and a Discord link.

## Setup Instructions

1. **Clone or Download**: Copy all files to a local directory.
2. **CodeMirror**: Download CodeMirror from https://codemirror.net/ or use the CDN links in `index.html`. Place `codemirror.js`, `codemirror.css`, and `lua.js` in the `codemirror/` folder.
3. **Discord Link**: Replace `https://discord.gg/your-discord-invite` in `index.html` with your Discord server invite or username link (e.g., `https://discord.com/users/YourUsername#1234`).
4. **Tutorials**: Update tutorial links in `index.html` with actual YouTube URLs for Delta and Xeno executor tutorials.
5. **ScriptBlox API**: The site uses the ScriptBlox API (https://scriptblox.com/api/script/fetch). Ensure a stable network connection, as required by the API documentation.[](https://docs.scriptblox.com/)
6. **Serve the Site**:
   - Use a local server (e.g., `python -m http.server` or VS Code Live Server).
   - Or deploy to a hosting platform like Vercel or Netlify.
7. **Test**: Open `index.html` in a browser to verify API integration, GUI, and functionality.

## Features
- **GUI**: Dark-themed, responsive interface with script cards fetched from ScriptBlox API.
- **Hover Effects**: Cards and Discord button animate on hover (scale and glow).
- **Script Creation**: CodeMirror-based editor for writing Lua scripts.
- **Downloads**: Download scripts from ScriptBlox API or custom scripts as `.lua` files.
- **Tutorials**: Placeholder links for Delta/Xeno executor tutorials.
- **Discord Button**: Links to your Discord server/username.
- **API Attribution**: Includes "Powered by ScriptBlox.com" as required.[](https://docs.scriptblox.com/)

## Notes
- The ScriptBlox API requires a stable network connection. Test API endpoints locally first.[](https://docs.scriptblox.com/)
- Saving scripts to a server requires a backend (e.g., Node.js with MongoDB).
- Warn users to use alternate Roblox accounts to avoid bans, as per Xeno/Delta guidelines.
- Add more tutorial links or script filters (e.g., search by query) for enhanced functionality.

## Dependencies
- CodeMirror (v5.65.7 or later) for the script editor.
- ScriptBlox API (https://scriptblox.com/api/script/fetch) for script data.
