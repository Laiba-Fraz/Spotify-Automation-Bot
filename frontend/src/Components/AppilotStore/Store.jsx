import BotCard from "../Cards/BotCard";
import classes from "./Store.module.css";
import AskingCard from "../Cards/AskingCard";
import HeroBanner from "./HeroBanner";
import { useState, useEffect } from "react";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { failToast } from "../../Utils/utils";

function AppilotStore() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [bots, setBots] = useState([]);
  const [botsList, setBotsList] = useState([]);
  const [Search, setSearch] = useState("");
  const auth = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBots() {
      try {
        setLoading(true);
        setError(null);
        const value = `${document.cookie}`;
        const response = await fetch("https://server.appilot.app/bots", {
        // const response = await fetch("http://127.0.0.1:8000/bots", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: value !== "" ? value.split("access_token=")[1] : "",
          },
        });

        const res = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            failToast("please logIn again")
            auth.dispatch({ type: "logout" });
            localStorage.removeItem("auth");
            navigate("/log-in");
          }
          throw new Error(res.message);
        }
        // console.log(res.data);
        setBots(res.data);
        setBotsList(res.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBots();
  }, []);

  function SearchHandler(val) {
    if (val.trim() === "") {
      setBotsList(bots);
    } else {
      setBotsList(
        bots.filter((el) =>
          el.botName.toLowerCase().includes(val.toLowerCase())
        )
      );
    }
    setSearch(val);
  }

  return (
    <section className={classes.storeSection}>
      <HeroBanner SearchHandler={SearchHandler} />
      <div className={classes.AllBotsTextContainer}>
        <h6>All Bots</h6>
        <p>Explore Bots for automating Your social media accounts.</p>
      </div>
      {loading ? (
        <div className={classes.loadingMain}>
          <div className={classes.loading}>
            <div className={classes.content}></div>
            <div className={classes.loadingEffect}></div>
          </div>
          <div className={classes.loading}>
            <div className={classes.content}></div>
            <div className={classes.loadingEffect}></div>
          </div>
          <div className={classes.loading}>
            <div className={classes.content}></div>
            <div className={classes.loadingEffect}></div>
          </div>
          <div className={classes.loading}>
            <div className={classes.content}></div>
            <div className={classes.loadingEffect}></div>
          </div>
          <div className={classes.loading}>
            <div className={classes.content}></div>
            <div className={classes.loadingEffect}></div>
          </div>
          <div className={classes.loading}>
            <div className={classes.content}></div>
            <div className={classes.loadingEffect}></div>
          </div>
        </div>
      ) : botsList.length > 0 ? (
        <div className={classes.cardsContainer}>
          {/* {botsList.map((el) => (
            <BotCard
              name={el.botName}
              desc={el.description}
              users={el.noOfUsers}
              image={el.imagePath}
              platform={el.platform}
              development={el.development}
              link={el.development? `/store/${name}`:`/store`}
            />
          ))} */}
                      {botsList.map((el) => {
              const name = el.botName.trim().replace(/\s+/g, "-");
              return <BotCard
                name={el.botName}
                desc={el.description}
                users={el.noOfUsers}
                image={el.imagePath}
                platform={el.platform}
                development={el.development}
                link={el.development? `/store/${name}`:``}
              />
})}
        </div>
      ) : (
        <div className={classes.noCardsContainer}>
          <span>No Result for "{Search}"</span>
        </div>
      )}
      <AskingCard />
    </section>
  );
}

export default AppilotStore;
