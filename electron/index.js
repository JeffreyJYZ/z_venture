const { app, BrowserWindow } = require("electron");

const URL = "http://z-venture.vercel.app";

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	mainWindow.loadURL(URL);
};

app.whenReady().then(() => {
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
