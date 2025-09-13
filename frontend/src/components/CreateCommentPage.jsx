import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createComment } from '../features/comments/commentThunk';
import { AUTH_STATUS } from '../features/auth/authConstants';

const CreateCommentPage = () => {
  const [searchParams] = useSearchParams();
  const offerId = searchParams.get('offer');
  const workerId = searchParams.get('worker');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.comments);

  const [formData, setFormData] = useState({
    text: '',
    rating: 5
  });
  const [photos, setPhotos] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(createComment({
        ...formData,
        photos,
        offer_id: offerId,
        worker_id: workerId,
      })).unwrap();
      
      navigate(`/workers/${workerId}`);
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">Write a Review</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div className="form-control">
              <label className="label px-12">
                <span className="label-text font-semibold">Rating</span>
              </label>
              <div className="rating rating-lg">
                {[1, 2, 3, 4, 5].map(star => (
                  <input
                    key={star}
                    type="radio"
                    name="rating"
                    className="mask mask-star-2 bg-orange-400"
                    value={star}
                    checked={formData.rating == star}
                    onChange={handleInputChange}
                  />
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div className="form-control">
              <label className="label mb-2 px-10">
                <span className="label-text font-semibold">Your Review </span>
              </label>
              <textarea
                name="text"
                className="textarea textarea-bordered h-32"
                placeholder="Share your experience with this worker..."
                value={formData.text}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Photo Upload */}
            <div className="form-control">
              <label className="label px-3">
                <span className="label-text font-semibold">Add Photos (Optional)</span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="file-input file-input-bordered"
              />
              
              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {photos.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-1 -right-1 btn btn-circle btn-xs btn-error"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="card-actions justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-neutral"
                disabled={status === AUTH_STATUS.LOADING || !formData.text.trim()}
              >
                {status === AUTH_STATUS.LOADING ? 'Publishing...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCommentPage;