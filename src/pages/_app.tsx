// import { type Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Provider } from "react-redux";
import "~/styles/globals.css";
import { store } from "~/utils/store";

// <{ session: Session | null }>
const MyApp: AppType = ({
  Component,
  pageProps: {
    // session
    ...pageProps
  },
}) => {
  return (
    <Provider store={store}>
      {/* <SessionProvider session={session}> */}
      <Component {...pageProps} />
      {/* </SessionProvider> */}
    </Provider>
  );
};

// export default api.withTRPC(MyApp);
export default MyApp;
