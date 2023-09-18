import { store, wrapper } from "@/store/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import styles from "./App.module.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div className={`${styles.container} ${inter.className}`}>
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default wrapper.withRedux(App);
