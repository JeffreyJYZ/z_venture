const { app, BrowserWindow, Menu } = require("electron");
const path = require("node:path");

const URL = "http://z-venture.vercel.app";
const ICON_PATH = path.join(__dirname, "../app/favicon.ico");

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		icon: ICON_PATH,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	mainWindow.setMenuBarVisibility(false);

	mainWindow.loadURL(URL);
};

app.whenReady().then(() => {
	Menu.setApplicationMenu(null);
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
