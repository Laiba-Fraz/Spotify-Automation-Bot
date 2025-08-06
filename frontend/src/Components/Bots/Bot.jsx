import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./Bot.module.css";
import BackLink from "../Animations/Links/BackLink";
import BotHead from "./BotHead";
import DemoCards from "../Cards/DemoCards";
import TextRedPurpleEffect from "../TextEffects/TextRedPurpleEffect";
import MenuBar from "../NavBars/MenuBar";
import GreenBtn from "../Buttons/GreenBtn";
import { useContext, useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "../Hooks/useAuthContext";
import { failToast } from "../../Utils/utils";
import { AddToPhoneOverlay } from "../context/AddToPhone";

function Bot() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [bot, setBot] = useState({});
  const id = useParams("id");
  const auth = useAuthContext();
  const navigate = useNavigate();
  const addToPhoneCtx = useContext(AddToPhoneOverlay);
  
  
  const navLinks = [
    {
      name: "README",
      route: "",
    },
    {
      name: "Features",
      route: "features",
    },
    {
      name: "Demos",
      route: "demos",
    },
    {
      name: "Documentation",
      route: "documentation",
    },
    {
      name: "Faqs",
      route: "faqs",
    },
    {
      name: "Issues",
      route: "issues",
    },
  ];

  useEffect(() => {
    async function loadBots() {
      const name = id.id.trim().replace(/-/g, " ");
      const fields = [
        "id",
        "botName",
        "description",
        "imagePath",
        "platform",
        "development",
      ];
      const queryString =
        new URLSearchParams({
          name: name,
        }).toString() +
        "&" +
        fields.map((field) => `fields=${field}`).join("&");
      const value = `${document.cookie}`;
      try {
        setLoading(true);
        setError(null);
        // const response = await fetch(`http://127.0.0.1:8000/get-bot?${queryString}`,{
        const response = await fetch(
          `https://server.appilot.app/get-bot?${queryString}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                value !== "" ? value.split("access_token=")[1] : "",
            },
          }
        );

        const res = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            console.log("inside 401 of bot");
            failToast("please logIn again");
            auth.dispatch({ type: "logout" });
            localStorage.removeItem("auth");
            navigate("/log-in");
          }
          throw new Error(res.message);
        }
        setBot(res.data);
        console.log(res.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBots();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      const botBanner = document.getElementById("botTopBanner");
      if (window.scrollY > 290) {
        botBanner.style.opacity = "1";
        botBanner.style.visibility = "visible";
      } else {
        botBanner.style.opacity = "0";
        botBanner.style.visibility = "hidden";
      }
    };
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []); // In this case, there are no external dependencies.

  function addToPhoneHandler() {
    addToPhoneCtx.showOverlay();
  }

  return (
    <>
      <div className={classes.botsPageTopBar} id="botTopBanner">
        <div className={classes.botPageTopBarInnerContainer}>
          <div className={classes.logo}>
            <img src={bot.imagePath} alt="Cheerio Scrapper" />
            <h5>{bot.botName}</h5>
          </div>
          <div className={classes.btnContainer}>
            <GreenBtn
              handler={
                bot.development
                  ? addToPhoneHandler
                  : () => {
                      return;
                    }
              }
            >
              {bot.development ? "Add To Phone" : "Underdevelopment"}
            </GreenBtn>
          </div>
        </div>
      </div>
      <section className={classes.BotSection}>
        <div className={classes.BotsmainSection}>
          <BackLink to={"/store"} linkName={"View all Bots"} />
          <div className={classes.BotMainContentConatiner}>
            <div className={classes.BotMainContent}>
              <BotHead
                name={Object.keys(bot).length === 0 ? "" : bot.botName}
                desc={Object.keys(bot).length === 0 ? "" : bot.description}
                imagePath={Object.keys(bot).length === 0 ? "" : bot.imagePath}
                id={bot.id}
                platform={bot.platform}
                development={bot.development}
              />
              <DemoCards linkContent={"Watch Demo"}>
                Do you want to{" "}
                <TextRedPurpleEffect>learn more</TextRedPurpleEffect> about this
                Bot?
              </DemoCards>
              <MenuBar navLinks={navLinks} />
              <Outlet />
            </div>
            <div className={classes.BotMainContentSidebar}></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Bot;
