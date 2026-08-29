const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(directoryPath, function(filePath) {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;

        // Fix occurrences that are strictly the string itself
        content = content.replace(
            /'https:\/\/aiot-vertical-farming-backend\.onrender\.com'/g, 
            "(import.meta.env.VITE_BACKEND_URL || 'https://aiot-vertical-farming-backend.onrender.com')"
        );
        content = content.replace(
            /"https:\/\/aiot-vertical-farming-backend\.onrender\.com"/g, 
            "(import.meta.env.VITE_BACKEND_URL || 'https://aiot-vertical-farming-backend.onrender.com')"
        );

        // Fix occurrences inside backticks
        content = content.replace(
            /`https:\/\/aiot-vertical-farming-backend\.onrender\.com\//g, 
            "`${import.meta.env.VITE_BACKEND_URL || 'https://aiot-vertical-farming-backend.onrender.com'}/"
        );

        // Fix occurrences that are the /api URL that don't already have import.meta.env checking
        // Actually, replacing the base URL inside the API URLs will result in something like:
        // (import.meta.env.VITE_BACKEND_URL || '...')./api/... which is bad syntax if we just do string replacement on base URL.
        // Let's refine: The previous replacements will change 'https://.../api/...' into (import.meta.env.VITE_BACKEND_URL || '...') + '/api/...'. Wait, no, they match strictly the exact string `'https://aiot-vertical-farming-backend.onrender.com'` with quotes! So it won't affect strings like `'https://.../api/something'`.

        // Let's handle strings that START with the URL
        content = content.replace(
            /'https:\/\/aiot-vertical-farming-backend\.onrender\.com(.*?)'/g,
            function(match, p1) {
                // If the match was exactly the base url, already handled above if we run this first.
                // Let's just convert it to a template literal.
                return "`${import.meta.env.VITE_BACKEND_URL || 'https://aiot-vertical-farming-backend.onrender.com'}" + p1 + "`";
            }
        );

        content = content.replace(
            /"https:\/\/aiot-vertical-farming-backend\.onrender\.com(.*?)"/g,
            function(match, p1) {
                return "`${import.meta.env.VITE_BACKEND_URL || 'https://aiot-vertical-farming-backend.onrender.com'}" + p1 + "`";
            }
        );

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
