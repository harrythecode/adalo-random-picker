import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

class RandomPicker extends Component {

  state = {
    title: "",
  };

  setTargetTitleRandomly = (eventOrigin = "onLoad") => {
    const { listOfDataSource, notFoundText, enableNotFoundText } = this.props;
    let targetText =
      enableNotFoundText && notFoundText ? notFoundText : "Not Found";
    let maxNum, randomNumber, randomItem;

    if (listOfDataSource && listOfDataSource.length > 0) {
      maxNum = listOfDataSource.length - 1 || 0;
      randomNumber = Math.floor(Math.random() * maxNum);
      randomItem = listOfDataSource[randomNumber].itemOfDataSourceList;
      if (randomItem) targetText = randomItem;
    }

    if (eventOrigin === "onLoad") {
      if (this.state.title === "") {
        this.setState({
          title: targetText,
        });
      }
    } else {
      this.setState({
        title: targetText,
      });
    }
  };

  triggerAction = () => {
    const { actionSettings } = this.props;

    if (actionSettings.enableClickRefresh) {
      this.setTargetTitleRandomly("onPress");
    } else if (actionSettings.clickActions) {
      actionSettings.clickActions(this.state.title);
    }
  };

  createPickerView = (viewGenre, viewContainerStyle, viewContentStyle) => {
    const { previewDemoText, enablePreviewDemoText } = this.props;
    const defaultPreviewText =
      enablePreviewDemoText && previewDemoText
        ? previewDemoText
        : "Preview demo";
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
      actionSettings,
      _width,
      _height,
      editor,
    } = this.props;

    this.setTargetTitleRandomly();
    const styles = StyleSheet.create({
      viewContainer: {
        width: _width,
        height: _height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        wordBreak: styleOptions.wordBreak,
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
        fontWeight: styleOptions.enableTextBold ? "bold" : "normal",
        textTransform: styleOptions.textTransform,
      },
    });

    let viewGenre = "view";
    if (editor) {
      viewGenre = "editor";
    } else if (
      actionSettings &&
      (actionSettings.clickActions || actionSettings.enableClickRefresh)
    ) {
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
