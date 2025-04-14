declare global {
  interface Window {
    fin?: any;
  }
}

export const isOpenFin = (): boolean => {
  return typeof window.fin !== 'undefined';
};

export const resizeToFullScreen = async () => {
  if (!isOpenFin()) {
    console.warn('Not running in OpenFin environment');
    return;
  }

  try {
    const currentWindow = window.fin.Window.getCurrentSync();
    const displayInfo = await window.fin.System.getMonitorInfo();
    const primaryDisplay = displayInfo.primaryMonitor;
    
    await currentWindow.setBounds({
      left: primaryDisplay.availableRect.left,
      top: primaryDisplay.availableRect.top,
      width: primaryDisplay.availableRect.right - primaryDisplay.availableRect.left,
      height: primaryDisplay.availableRect.bottom - primaryDisplay.availableRect.top
    });
  } catch (error) {
    console.error('Error resizing window:', error);
  }
};

export const openNewWindow = async (windowName: string) => {
  if (!isOpenFin()) {
    console.warn('Not running in OpenFin environment');
    return;
  }

  try {
    // Get the current application UUID
    const appUuid = window.fin.me.uuid;

    const options = {
      name: windowName,
      url: `http://localhost:5173/`,
      defaultWidth: 800,
      defaultHeight: 600,
      maximized: true,
      autoShow: true,
      frame: false,
      uuid: appUuid
    };

    // Create the window
    await window.fin.Window.create(options);

  } catch (error) {
    console.error('Error opening window:', error);
  }
};

export const hideCurrentWindow = async () => {
  if (!isOpenFin()) {
    console.warn('Not running in OpenFin environment');
    return;
  }

  try {
    const currentWindow = window.fin.Window.getCurrentSync();
    await currentWindow.hide();
  } catch (error) {
    console.error('Error hiding window:', error);
  }
};
