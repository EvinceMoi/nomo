import * as Neutralino from '@neutralinojs/lib';

const set_tray = () => {
  const tray = {
    icon: '/app/assets/icon/nomo.png',
    menuItems: [
      { id: 'SHOW', text: 'Show' },
      { id: 'VERSION', text: 'Show Version' },
      { id: 'SEP', text: '-' },
      { id: 'QUIT', text: 'Quit' }
    ]
  };
  Neutralino.os.setTray(tray);
};

export const init = async () => {
  Neutralino.init();
  Neutralino.events.on('trayMenuItemClicked', (event) => {
    switch(event.detail.id) {
      case 'SHOW':
        Neutralino.window.show();
        break;
      case 'VERSION':
        Neutralino.os.showNotification('Version', '1.0.0');
        break;
      case 'QUIT':
        Neutralino.app.exit();
        break;
    }
  });
  Neutralino.events.on('windowClose', () => {
    Neutralino.window.hide().catch(e => {
      console.log(JSON.stringify(e));
    });
  });

  set_tray();
};