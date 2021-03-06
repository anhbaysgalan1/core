import { Meteor } from "meteor/meteor";
import { Category } from "./Category";

import "../imports/startup/server/main.js";

Meteor.startup(() => {
  const categories = [
    {
      "icon": "animation.png",
      "title": "Animation",
      "slug": "animation"
    },
    {
      "icon": "architecture.png",
      "title": "Architecture",
      "slug": "architecture"
    },
    {
      "icon": "art.png",
      "title": "Arts & Culture",
      "slug": "art"
    },
    {
      "icon": "artificial-intelligence.png",
      "title": "Artificial Intelligence",
      "slug": "artificial-intelligence"
    },
    {
      "icon": "astronomy.png",
      "title": "Astronomy",
      "slug": "astronomy"
    },
    {
      "icon": "behavioural-science.png",
      "title": "Behavioural Science",
      "slug": "behavioural-science"
    },
    {
      "icon": "biology.png",
      "title": "Biology",
      "slug": "biology"
    },
    {
      "icon": "business.png",
      "title": "Business & Management",
      "slug": "business"
    },
    {
      "icon": "chemistry.png",
      "title": "Chemistry",
      "slug": "chemistry"
    },
    {
      "icon": "climate-science.png",
      "title": "Climate Science",
      "slug": "climate-science"
    },
    {
      "icon": "code.png",
      "title": "Computer Science",
      "slug": "computer-science"
    },
    {
      "icon": "curiosity.png",
      "title": "Curiosity",
      "slug": "curiosity",
      "hideAtOnboarding": true
    },
    {
      "icon": "data-science.png",
      "title": "Data Science",
      "slug": "data-science"
    },
    {
      "icon": "design.png",
      "title": "Design",
      "slug": "design"
    },
    {
      "icon": "economics.png",
      "title": "Economics & Finance",
      "slug": "economics"
    },
    {
      "icon": "engineering.png",
      "title": "Engineering",
      "slug": "engineering"
    },
    {
      "icon": "startup.png",
      "title": "Entrepreneurship",
      "slug": "entrepreneurship"
    },
    {
      "icon": "filmmaking.png",
      "title": "Filmmaking",
      "slug": "filmmaking"
    },
    {
      "icon": "fun-facts.png",
      "title": "Fun Facts",
      "slug": "fun-facts"
    },
    {
      "icon": "history.png",
      "title": "History",
      "slug": "history"
    },
    {
      "icon": "humanities.png",
      "title": "Humanities",
      "slug": "humanities"
    },
    {
      "icon": "languages.png",
      "title": "Languages",
      "slug": "languages"
    },
    {
      "icon": "life-hacks.png",
      "title": "Life Hacks",
      "slug": "life-hacks"
    },
    {
      "icon": "marketing.png",
      "title": "Marketing",
      "slug": "marketing"
    },
    {
      "icon": "mathematics.png",
      "title": "Mathematics",
      "slug": "mathematics"
    },
    {
      "icon": "medicine.png",
      "title": "Medicine",
      "slug": "medicine"
    },
    {
      "icon": "personal-development.png",
      "title": "Personal Development",
      "slug": "personal-development"
    },
    {
      "icon": "personal-finance.png",
      "title": "Personal Finance",
      "slug": "personal-finance"
    },
    {
      "icon": "philosophy.png",
      "title": "Philosophy",
      "slug": "philosophy"
    },
    {
      "icon": "photography.png",
      "title": "Photography",
      "slug": "photography"
    },
    {
      "icon": "physics.png",
      "title": "Physics",
      "slug": "physics"
    },
    {
      "icon": "politics.png",
      "title": "Political Sciences",
      "slug": "political-sciences"
    },
    {
      "icon": "psychology.png",
      "title": "Psychology",
      "slug": "psychology"
    },
    {
      "icon": "tech.png",
      "title": "Technology",
      "slug": "technology"
    },
    {
      "icon": "writing.png",
      "title": "Writing",
      "slug": "writing"
    }
  ];

  if (Category.find().count() < categories.length) {
    categories.forEach((current) => Category.insert(current));
  }
});
