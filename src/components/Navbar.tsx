import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const [time, setTime] = useState("");
    const location = useLocation();

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, "0");
            const m = String(now.getMinutes()).padStart(2, "0");
            const s = String(now.getSeconds()).padStart(2, "0");
            setTime(`${h}:${m}:${s}`);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className={styles.navbar}>
            <div className={styles.navLeft}>
                <img src={logo} alt="logo" className={styles.logo} />
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/entries">Entries</Link>
                    </li>
                    <li>
                        <Link to="/editor">Editor</Link>
                    </li>
                </ul>
            </div>
            <div className={styles.navCenter}>{location.pathname}</div>

            <span className={styles.navRight}>{time}</span>
        </div>
    );
}
