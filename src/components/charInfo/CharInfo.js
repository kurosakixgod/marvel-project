import { useState, useEffect } from 'react';

import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null),
          [loading, setLoading] = useState(false),
          [error, setError] = useState(false);

    const marvelService = new MarvelService();

    
    useEffect(() => {
        updateChar();
        // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    },[props.charId])

    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    } 

    const onCharLoading = () => {
        setLoading(true);
    }

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        onCharLoading();
        marvelService
                .getChar(charId)
                .then(onCharLoaded)
                .catch(onError)
    }
    
    const skeleton = loading || error || char ? null : <Skeleton/>
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) && char ? <View char={char}/> : null;

    
    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    );
}

const View = ({char}) => {
    const {thumbnail, name, wiki, homepage, description, comics} = char;
    const comicsView = comics.map((item,i) => {
        return (
            <li className="char__comics-item" key={i}>
                {item.name}
            </li>
        );
    }).slice(0,10);
    let imgStyle = {objectFit: 'cover'}
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {objectFit: 'unset'}
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? 'This person wasnt noticed in comics' : comicsView}
            </ul>
        </>
    );
}

export default CharInfo;

