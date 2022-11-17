const {app,BrowserWindow,Menu,ipcMain} = require('electron');
const url = require('url');
const path  = require('path');

if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname,{
        electron: path.join(__dirname, '../node_modules','.bin','electron')
    })
    
}

let mainWindow
let newProductWindow

app.on('ready', () =>{
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
        
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('close', () =>{
        app.quit();
    });

});

function createNewProduct(){
    newProductWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width:400,
        height:330,
        title: 'Add a new product'
    });
    //newProductWindow.setMenu(null);
    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }))
    newProductWindow.on('closed', () =>{
        newProductWindow  =null;
    });
}

ipcMain.on('product:new', (e, newProduct) => {
    // send to the Main Window
    console.log(newProduct);
    mainWindow.webContents.send('product:new', newProduct);
    newProductWindow.close();
  });

const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Product',
                accelerator: 'Ctrl+N',
                click(){
                    createNewProduct();
                }
            },
            {
                label: 'Remove All Products',
                click(){
                    mainWindow.webContents.send('prodcts:remove-all');
                }
            },
            {
                label: 'Exit',
                click(){
                    app.quit();
                }
            },
        ]
    },
];

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
      label: 'DevTools',
      submenu: [
        {
          label: 'Show/Hide Dev Tools',
          accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload'
        }
      ]
    })
  }