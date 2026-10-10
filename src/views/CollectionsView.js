// CollectionsView.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'reactstrap';
import TitleBox from '../components/TitleBox.js';
import CollectionCard from '../components/cards/CollectionCard.js';
import { getCollections } from '../helpers/data/collectionData.js';

const CollectionsView = ({
  user
}) => {
  const [collectionArray, setCollectionArray] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/add-collection');
  };

  useEffect(() => {
    let mounted = true;
    getCollections(user.uid).then((respArr) => {
      if (mounted) {
        setCollectionArray(respArr);
        setLoaded(true);
      }
    });
    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div className='collections-view'>
      <TitleBox heading1='Collections' />
      <div className='view-button-container'>
        <Button className='btn btn-info add-collection'
        onClick={handleAddClick} >Add Collection</Button>
      </div>
      <div className='card-container collection-cards-container'>
      { !loaded && <Spinner className='workout-view-spinner' color='primary' /> }
        { collectionArray.map((collectionObj) => <CollectionCard
          key={collectionObj.id}
          user={user}
          collection={collectionObj}
          setCollectionArray={setCollectionArray} />) }
      </div>
    </div>
  );
};

CollectionsView.propTypes = {
  user: PropTypes.any
};

export default CollectionsView;
