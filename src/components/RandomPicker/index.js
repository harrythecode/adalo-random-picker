import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";

class RandomPicker extends Component {
  globalStoredList;
  state = {
    title: "",
  };

  getRandomItem = (listData, maxNum = 0) => {
    let res = { randomItem: "", randomNum: 0 };
    if (listData.length > 0) {
      const randomNum = Math.floor(Math.random() * maxNum);
      const pickedItem = listData[randomNum].itemOfDataSourceList;
      res = { randomItem: pickedItem, randomNum: randomNum };
    }

    return res;
  };

  setTargetTitleRandomly = (eventOrigin = "onLoad") => {
    const {
      introText,
      actionType,
      listOfDataSource,
      enableRemoveDuplicatesOnRefresh,
    } = this.props;

    let isTriggered, targetList;
    const storedList = this.globalStoredList || listOfDataSource;

    // Exit if
    // No data
    if (!listOfDataSource || !storedList) return null;
    // OnLoad && !Init
    if (eventOrigin === "onLoad" && this.state.title !== "") return null;

    if (enableRemoveDuplicatesOnRefresh) {
      targetList = storedList;
    } else {
      targetList = listOfDataSource;
    }

    const response = this.getRandomItem(targetList, targetList.length);
    const { randomItem, randomNum } = response;
    const targetText = randomItem || "Not Found";

    // 1. Pick item randomly
    // 2. Refresh Action
    // 3. (Uniq) update list

    if (eventOrigin === "onLoad") {
      // Initial Loading
      if (this.state.title === "") {
        const initialText =
          actionType === 20 && introText ? introText : targetText;
        this.setState({ title: initialText });
        isTriggered = actionType === 20 && introText ? false : true;
      }
    } else {
      this.setState({ title: targetText });
      isTriggered = true;
    }

    if (isTriggered && randomNum > -1) {
      const { refreshActions } = targetList[randomNum] || "";
      if (actionType === 20 && refreshActions) {
        refreshActions(targetText);
      }
      if (enableRemoveDuplicatesOnRefresh) {
        let tempArray = storedList;
        tempArray.splice(randomNum, 1);
        this.globalStoredList = tempArray;
      }
    }
  };

  triggerAction = () => {
    const { actionType, listOfDataSource } = this.props;
    if (actionType === 20) {
      this.setTargetTitleRandomly("onPress");
    } else if (listOfDataSource) {
      const { clickActions } = listOfDataSource[randomNum];
      if (clickActions) {
        clickActions(this.state.title);
      }
    }
  };

  createPickerView = (viewGenre, viewContainerStyle, viewContentStyle) => {
    const defaultPreviewText = "Preview demo";
    // viewGenre: editor, view, button
    let jsxElem;
    if (viewGenre === "editor") {
      jsxElem = (
        <View style={viewContainerStyle}>
          <Text style={viewContentStyle}>{defaultPreviewText}</Text>
        </View>
      );
    } else if (viewGenre === "button") {
      jsxElem = (
        <TouchableOpacity
          style={viewContainerStyle}
          onPress={this.triggerAction}
        >
          <Text style={viewContentStyle}>{this.state.title}</Text>
        </TouchableOpacity>
      );
    } else {
      jsxElem = (
        <View style={viewContainerStyle}>
          <Text style={viewContentStyle}>{this.state.title}</Text>
        </View>
      );
    }

    return jsxElem;
  };

  render() {
    const {
      styleOptions,
      _width,
      _height,
      editor,
      listOfDataSource,
    } = this.props;

    if (!editor) this.setTargetTitleRandomly();

    const styles = {
      viewContainer: {
        width: _width,
        height: _height,
        display: "flex",
        alignItems: "center",
        wordBreak: "break-all",
        justifyContent: "center",
        borderWidth: styleOptions.borderWidth,
        borderColor: styleOptions.borderColor,
        borderStyle: styleOptions.borderStyle,
        borderRadius: styleOptions.borderRadius,
        backgroundColor: styleOptions.backgroundColor,
      },
      viewContent: {
        alignSelf: "center",
        color: styleOptions.textColor,
        padding: styleOptions.textPadding,
        fontSize: styleOptions.textSize,
        fontWeight: styleOptions.fontWeight,
        textTransform: styleOptions.textTransform,
      },
    };
    let viewGenre = "view";
    if (editor) {
      viewGenre = "editor";
    } else if (listOfDataSource) {
      viewGenre = "button";
    }

    return this.createPickerView(
      viewGenre,
      styles.viewContainer,
      styles.viewContent
    );
  }
}

export default RandomPicker;
