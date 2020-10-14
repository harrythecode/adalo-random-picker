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
      notFoundText,
      actionType,
      listOfDataSource,
      enableRemoveDuplicatesOnRefresh,
    } = this.props;

    let isTriggered, targetList;
    const storedList = this.globalStoredList || listOfDataSource;
    const defaultNotFound = notFoundText || "Not Found";

    // Exit if
    // No data
    if (!listOfDataSource || !storedList) return null;
    // OnLoad && !Init
    if (eventOrigin === "onLoad" && this.state.title !== "") return null;

    if (actionType === 20 && enableRemoveDuplicatesOnRefresh) {
      targetList = storedList;
    } else {
      targetList = listOfDataSource;
    }

    const response = this.getRandomItem(targetList, targetList.length);
    const { randomItem, randomNum } = response;
    const targetText = randomItem || defaultNotFound;

    // 1. Pick item randomly
    // 2. Refresh Action
    // 3. (Uniq) update list

    if (eventOrigin === "onLoad") {
      // Initial Loading
      if (this.state.title === "") {
        const initialText =
          actionType === 20 && introText ? introText : targetText;
        this.setState({ title: initialText });
        isTriggered =
          (actionType === 20 && introText) || actionType === 10 ? false : true;
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
      if (actionType === 20 && enableRemoveDuplicatesOnRefresh) {
        let tempArray = storedList;
        tempArray.splice(randomNum, 1);
        this.globalStoredList = tempArray;
      }

      const { clickActions } = targetList[randomNum] || "";
      if (actionType === 10 && clickActions) {
        clickActions(targetText);
      }
    }
  };

  triggerAction = () => {
    const { listOfDataSource } = this.props;
    if (listOfDataSource) {
      this.setTargetTitleRandomly("onPress");
    }
  };

  createPickerView = (viewGenre, viewContainerStyle, viewContentStyle) => {
    const { notFoundText, listOfDataSource } = this.props;
    const defaultPreviewText =
      (listOfDataSource && listOfDataSource[0].itemOfDataSourceList) ||
      "Preview demo";
    const defaultNotFound = notFoundText || "Not Found";
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
          <Text style={viewContentStyle}>{defaultNotFound}</Text>
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

    const containerStyle = {
      width: _width,
      height: _height,
      display: "flex",
      alignItems: "center",
      wordBreak: "break-all",
      justifyContent: "center",
      borderWidth: styleOptions.enableBorderWidth
        ? styleOptions.borderWidth
        : 0,
      borderColor: styleOptions.enableBorderWidth
        ? styleOptions.borderColor
        : null,
      borderStyle: styleOptions.enableBorderWidth
        ? styleOptions.borderStyle
        : null,
      borderRadius: styleOptions.enableBorderWidth
        ? styleOptions.borderRadius
        : 0,
      backgroundColor: styleOptions.backgroundColor,
    };

    // https://ethercreative.github.io/react-native-shadow-generator/
    const shadowStyle = {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,

      elevation: 6,
    };

    const targetContainerStyle = styleOptions.enableShadow
      ? Object.assign(containerStyle, shadowStyle)
      : containerStyle;

    const styles = {
      viewContainer: targetContainerStyle,
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
