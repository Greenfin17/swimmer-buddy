// CollectionForm.js

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Form, FormGroup,
  Label, Input,
  Button
} from 'reactstrap';
import {
  getSingleCollection,
  addCollection,
  updateCollection
} from '../../helpers/data/collectionData.js';

const CollectionForm = ({
  user,
}) => {
  const [collection, setCollection] = useState({
    author_uid: user.uid,
    description: '',
    title: ''
  });
  const navigate = useNavigate();

  const { id } = useParams();

  const handleInputChange = (e) => {
    setCollection((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value ? e.target.value : '',
    }));
  };

  const handleCancelClick = () => {
    navigate('/collections');
  };

  const handleSubmit = () => {
    if (id) {
      updateCollection(id, collection).then(() => {
        navigate('/collections');
      });
    } else {
      addCollection(collection).then(() => {
        navigate('/collections');
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    if (id) {
      getSingleCollection(id).then((respObj) => {
        if (mounted) {
          setCollection(respObj);
        }
      });
    }
    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div className='form-container collection-form-container'>
      <Form className='collection-form mb-4'>
        <div className='form-group-container'>
          <FormGroup className='collection-form-group'>
            <Label for='collection-title'>Collection Title</Label>
            <Input type='text' className='form-control' aria-describedby='Workout Title'
              name='title' value={collection.title || ''} onChange={handleInputChange}
              placeholder='Enter Collection Title' />
            <Label for='collection-description'>Description</Label>
            <Input type='text' className='form-control' aria-describedby='Collection Description'
              name='description' value={collection.description || ''} onChange={handleInputChange}
              placeholder='Collection Description' />
            <div className='mt-auto card-btn-container'>
              <Button className='btn btn-info btn-submit-collection'
                onClick={handleSubmit}>Submit Collection</Button>
              <Button className="btn btn-secondary"
                onClick={handleCancelClick}>Cancel</Button>
            </div>
          </FormGroup>
         </div>
      </Form>
    </div>
  );
};

CollectionForm.propTypes = {
  user: PropTypes.any
};

export default CollectionForm;
