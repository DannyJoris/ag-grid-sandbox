declare global {
  interface Window {
    fin?: any;
  }
}

export const isOpenFin = (): boolean => {
  return typeof window.fin !== 'undefined';
};

export const openNewWindow = async (windowName: string, url: string, position: 'left' | 'right') => {
  if (!isOpenFin()) {
    console.warn('Not running in OpenFin environment');
    return;
  }

  try {
    // Get the current application UUID
    const appUuid = window.fin.me.uuid;

    // Get monitor info to calculate window size
    const displayInfo = await window.fin.System.getMonitorInfo();
    const primaryDisplay = displayInfo.primaryMonitor;
    const availableWidth = primaryDisplay.availableRect.right - primaryDisplay.availableRect.left;
    const availableHeight = primaryDisplay.availableRect.bottom - primaryDisplay.availableRect.top;

    let defaultWidth = 0;
    let defaultLeft = 0;
    if (position === 'left') {
      defaultWidth = availableWidth - 400;
      defaultLeft = primaryDisplay.availableRect.left;
    } else if (position === 'right') {
      defaultWidth = 400;
      defaultLeft = primaryDisplay.availableRect.right - 400;
    }

    const windowOptions = {
      name: windowName,
      url,
      defaultWidth,
      defaultHeight: availableHeight,
      defaultTop: primaryDisplay.availableRect.top,
      defaultLeft,
      maximized: false,
      autoShow: true,
      frame: false,
      uuid: appUuid
    };

    // Create the window
    await window.fin.Window.create(windowOptions);

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

export const broadcastInfoId = async (id: string) => {
  if (!isOpenFin()) {
    console.warn('Not running in OpenFin environment');
    return;
  }

  try {
    // Broadcast the ID to all applications
    await window.fin.InterApplicationBus.publish('info-channel', { id });
    
    console.log(`Broadcasted info ID: ${id}`);
  } catch (error) {
    console.error('Error broadcasting info ID:', error);
  }
};

export const subscribeToInfoId = (callback: (id: string) => void) => {
  if (!isOpenFin()) {
    console.warn('Not running in OpenFin environment');
    return () => {}; // Return empty cleanup function
  }

  try {
    // Subscribe to the channel
    const subscription = window.fin.InterApplicationBus.subscribe(
      { uuid: '*' }, // Listen to all applications
      'info-channel',
      (message: any, uuid: string, name: string) => {
        if (message && message.id) {
          callback(message.id);
        }
      }
    );

    // Return cleanup function
    return () => {
      try {
        // Properly unsubscribe using the subscription object
        window.fin.InterApplicationBus.unsubscribe(subscription);
      } catch (error) {
        console.error('Error unsubscribing from info ID:', error);
      }
    };
  } catch (error) {
    console.error('Error subscribing to info ID:', error);
    return () => {}; // Return empty cleanup function
  }
};

export const broadcastAuthStatus = async (isAuthenticated: boolean, user?: any) => {
  if (!isOpenFin()) {
    console.warn('Not running in OpenFin environment');
    return;
  }

  try {
    // Broadcast the authentication status to all applications
    await window.fin.InterApplicationBus.publish('auth-channel', {
      isAuthenticated,
      user,
      timestamp: new Date().toISOString()
    });

    console.log(`Broadcasted auth status: ${isAuthenticated}`);
  } catch (error) {
    console.error('Error broadcasting auth status:', error);
  }
};

export const subscribeToAuthStatus = (callback: (isAuthenticated: boolean, user?: any) => void) => {
  if (!isOpenFin()) {
    console.warn('Not running in OpenFin environment');
    return () => {}; // Return empty cleanup function
  }

  try {
    // Subscribe to the channel
    const subscription = window.fin.InterApplicationBus.subscribe(
      { uuid: '*' }, // Listen to all applications
      'auth-channel',
      (message: any, uuid: string, name: string) => {
        if (message && typeof message.isAuthenticated === 'boolean') {
          callback(message.isAuthenticated, message.user);
        }
      }
    );

    // Return cleanup function
    return () => {
      try {
        // Properly unsubscribe using the subscription object
        window.fin.InterApplicationBus.unsubscribe(subscription);
      } catch (error) {
        console.error('Error unsubscribing from auth status:', error);
      }
    };
  } catch (error) {
    console.error('Error subscribing to auth status:', error);
    return () => {}; // Return empty cleanup function
  }
};
