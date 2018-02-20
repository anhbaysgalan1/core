import React, { Component } from "react";
import { compose } from "react-komposer";
import { Meteor } from "meteor/meteor";
import CategoryCarousel from "../components/CategoryCarousel";
import { getAllCategories } from "/imports/api/Category";

class CategoryCarouselContainer extends Component {
  constructor() {
    super();

    this.state = {
      checkedCategories: []
    };
  }

  handleCategoryClick = (slug) => {
    let { checkedCategories } = this.state;

    if (checkedCategories.includes(slug)) {
      checkedCategories = checkedCategories.filter(currentSlug => currentSlug !== slug);
    } else if (checkedCategories.length < 6) {
      checkedCategories.push(slug);
    }

    this.setState({
      checkedCategories
    }, () => {
      if (this.state.checkedCategories.length === 6) {
        this.props.onPickingOver(this.state.checkedCategories);
      }
    })
  };

  render() {
    return (
      <CategoryCarousel
        categories={this.props.categories}
        checkedCategories={this.state.checkedCategories}
        onCategoryClick={this.handleCategoryClick}
      />
    )
  }
}

function getTrackerLoader(reactiveMapper) {
  return (props, onData, env) => {
    let trackerCleanup = null;
    const handler = Tracker.nonreactive(() => {
      return Tracker.autorun(() => {
        // assign the custom clean-up function.
        trackerCleanup = reactiveMapper(props, onData, env);
      });
    });

    return () => {
      if (typeof trackerCleanup === "function") trackerCleanup();
      return handler.stop();
    };
  };
}

async function dataLoader(props, onData) {
  const categorySubscription = Meteor.subscribe("categories");

  if (categorySubscription.ready()) {
    const categories = getAllCategories();

    onData(null, {
      categories
    });
  }
}

export default compose(
  getTrackerLoader(dataLoader)
)(CategoryCarouselContainer);
