import { Component } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllChars()
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    updateCharList = () => {
        this.marvelService
                .getAllChars()
                .then(this.onCharListLoaded)
                .catch(this.onError)
    }

    renderItems(arr) {
        const listItems = arr.map(item => {
            const {name,thumbnail,id} = item;
            let imgStyle = {objectFit: 'cover'}
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {objectFit: 'unset'}
            }
            return (
                <li 
                    className="char__item char__item_selected"
                    key={id}
                    onClick={() => this.props.onCharSelected(item.id)}>
                        <img src={thumbnail} alt="abyss" style={imgStyle}/>
                        <div className="char__name">{name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {listItems}
            </ul>
        )
    }

    render() {
        const {charList, error, loading} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;