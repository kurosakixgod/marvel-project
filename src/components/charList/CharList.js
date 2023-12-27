import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';
import CharInfo from '../charInfo/CharInfo';

const CharList = (props) => {
    const [charList, setCharList] = useState([]),
          [loading, setLoading] = useState(true),
          [error, setError] = useState(false),
          [newItemLoading, setNewItemLoading] = useState(false),
          [offset, setOffset] = useState(210),
          [charEnded, setCharEnded]= useState(false);
          
    
    const marvelService = new MarvelService();
    
    const onRequest = (offset) => {
        onCharListLoading();
        marvelService
            .getAllChars(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    useEffect(() => {
        onRequest(); 
        // eslint-disable-next-line
    }, []) 


    const onCharListLoaded = (newCharList) => {
        setCharList(charList => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(newCharList.length < 9 ? true : false)

    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemRefs = useRef([]);

    const onRefFocus = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }


    function renderItems(arr) {
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
                    ref={(el) => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(id)
                        onRefFocus(i)
                    }}
                    onKeyDown ={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(id)
                            onRefFocus(i)
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

    const items = renderItems(charList);

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
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharInfo.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;