import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';
import CharInfo from '../charInfo/CharInfo';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }
    
    marvelService = new MarvelService();
    
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllChars(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    componentDidMount() {
        this.onRequest();
    }


    onCharListLoaded = (newCharList) => {

        this.setState(({charList,offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: newCharList.length < 9 ? true : false
        }))
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

    itemRefs = []

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    onRefFocus = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
    }


    renderItems(arr) {
        let imgStyle = {objectFit: 'cover'};
        
        const listItems = arr.map((item,i) => {
            const {name,thumbnail,id} = item;

            // const active = this.props.charId === item.id;
            // const clazz = active ? 'char__item char__item_selected' : 'char__item';

            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {objectFit: 'unset'}
            }
            return (
                <li 
                    className="char__item"
                    key={id}
                    tabIndex={0}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(id)
                        this.onRefFocus(i)
                    }}
                    onKeyDown ={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(id)
                            this.onRefFocus(i)
                        }
                    }}>
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
        const {charList, error, loading, newItemLoading, offset,charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                        disabled={newItemLoading}
                        style={{display: charEnded ? 'none' : 'block'}}
                        onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharInfo.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;