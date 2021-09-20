package ten.binary.wallet;

import android.os.Bundle;
import android.content.Context;
import android.webkit.WebView;
import com.facebook.react.ReactActivity;
import android.app.NotificationManager;

public class MainActivity extends ReactActivity {

  @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        WebView.setWebContentsDebuggingEnabled(true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Remove all notification when app is open
        NotificationManager notificationManager = (NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
    }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "wallet";
  }
}
