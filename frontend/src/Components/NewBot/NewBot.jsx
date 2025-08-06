import classes from "./NewBot.module.css";
import BotCard from "../Cards/BotCard";
import AskingCard from "../Cards/AskingCard";
import H24 from "../Headings/H24";
import P14G from "../Paragraphs/P14G";
import BackLink from "../Animations/Links/BackLink";
import H20 from "../Headings/H20";
import { useEffect, useState } from "react";
import { failToast } from "../../Utils/utils";
import { useParams } from "react-router-dom";

function NewBot() {
  const [loading, setLoading] = useState(null);
  const [botsList, setBotsList] = useState([]);
  const currentUrl = window.location.href;
  let backLink, backString, heading, subHeading, sectionHead;
  if(currentUrl.includes('/tasks')){
    backLink = "/tasks"
    backString = "All tasks"
    heading = "Create a new Task"
    subHeading = "Choose your desired bot to create new Task"
    sectionHead = "Available bots are clickable"
  }else if(currentUrl.includes('/devices')){
    backLink = "/devices"
    backString = "All devices"
    heading = "Add a new Device"
    subHeading = "Choose your desired bot to add to a new Device"
    sectionHead = "Available bots are clickable"
  }


  useEffect(() => {
    async function loadBots() {
      console.log("inside useEffext");
      try {
        setLoading(true);
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
            console.log("inside 401");
            failToast("please logIn again");
            auth.dispatch({ type: "logout" });
            localStorage.removeItem("auth");
            navigate("/log-in");
          }
          throw new Error(res.message);
        }
        // console.log(res.data);
        setBotsList(res.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }

    loadBots();
  }, []);
  return (
    <section className={classes.new}>
      <BackLink to={backLink} linkName={backString} /> 
      <div className={classes.main}>
        <div className={classes.header}>
          <H24>{heading}</H24>
          <P14G>
            {subHeading}
          </P14G>
          <H20>{sectionHead}</H20>
        </div>
        <div className={classes.heading}></div>
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
        ) : (
          <div className={classes.cardsContainer}>
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
        )}
        <AskingCard />
      </div>
    </section>
  );
}

export default NewBot;
