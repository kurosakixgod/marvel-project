import { Component } from "react";
import PropTypes from 'prop-types'

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

class App extends Component {
    state = {
        selectedChar: null,
        isSelected: false
    }

    setRef = (el) => {
        this.myRef = el;
    }

    onCharSelected = (id) => {
        this.setState({
            selectedChar: id,
            isSelected: true
        })
    }

    render() {
        return (
            <div className="app">
                <AppHeader/>
                <main>
                    <RandomChar/>
                    <div className="char__content">
                        <CharList onCharSelected={this.onCharSelected} charId={this.state.selectedChar} setRef={this.setRef} isSelected={this.state.isSelected}/>
                        <ErrorBoundary>
                            <CharInfo charId ={this.state.selectedChar}/>
                        </ErrorBoundary>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        );
    }
}

export default App;

App.propTypes = {
    onCharSelected: PropTypes.array
}
