import SearchBar from "../SearchBar/SearchBar";
import H36 from "./../Headings/H36";
import classes from "./HeroBanner.module.css";
import KeywordsTags from "./KeywordsTags";
import TextRedPurpleEffect from "../TextEffects/TextRedPurpleEffect";

function HeroBanner(props) {
  const keywords = [
    "Social media growth",
    "AI-driven tools",
    "Content scheduling",
    "Audience engagement",
    "Follower growth",
    "Analytics",
    "Profile optimization",
    "Hashtag research",
    "Brand visibility",
    "Post automation",
    "Influencer outreach",
    "Engagement tracking",
  ];
  
  
  function searchHandler(val){
    props.SearchHandler(val)
  }
  return (
    <div className={classes.HeroBannermain}>
      <H36>
        Appilot <TextRedPurpleEffect>Store</TextRedPurpleEffect>
      </H36>
      <p className={classes.heroBannerSubHeading}>
        Find Your desired social media bots for automation.
      </p>
      <SearchBar searchHandler={searchHandler}/>
      <KeywordsTags keys={keywords} />
    </div>
  );
}

export default HeroBanner;
