declare global {
  interface Window {
    fin?: any;
  }
}

export const isOpenFin = () => {
  return window.fin !== undefined;
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