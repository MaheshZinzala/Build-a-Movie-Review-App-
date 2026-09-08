import "./App.css";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

const initialValues = {
  title: "",
  review: "",
  rating: "",
  recommend: false,
};

const validationSchema = yup.object({
  title: yup.string().required("Movie title is required"),
  review: yup
    .string()
    .required("Review text is required")
    .min(10, "Review must be at least 10 characters"),
  rating: yup.string().required("Please select a rating"),
  recommend: yup.boolean(),
});

function App() {
  const [reviews, setReviews] = useState([]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let new_val = [...reviews, values];
      localStorage.setItem("Movies_Review", JSON.stringify(new_val));
      setReviews(new_val);
      resetForm();
    },
  });

  useEffect(() => {
    let localReview = JSON.parse(localStorage.getItem("Movies_Review"));
    if (localReview) {
      setReviews(localReview);
    }
  }, []);
  return (
    <div className="grid grid-cols-12 min-h-screen bg-gray-900 text-white">
      {/* Form Section */}
      <div className="col-span-12 lg:col-span-6 isolate px-6 py-12 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Movie Review App
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 max-w-xl sm:mt-12"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            {/* Movie Title */}
            <div className="sm:col-span-2">
              <label
                htmlFor="title"
                className="block text-md font-semibold text-white"
              >
                Movie Title:
              </label>
              <div className="mt-2.5">
                <input
                  id="title"
                  type="text"
                  name="title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                />
                {errors.title && touched.title && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.title}
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div className="sm:col-span-2">
              <label
                htmlFor="review"
                className="block text-md font-semibold text-white"
              >
                Review Text
              </label>
              <div className="mt-2.5">
                <textarea
                  id="review"
                  name="review"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.review}
                  rows={4}
                  className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                />
                {errors.review && touched.review && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.review}
                  </span>
                )}
              </div>
            </div>

            {/* Rating Stars */}
            <div className="sm:col-span-2">
              <label className="block text-md font-semibold text-white mb-3">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value={star.toString()}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.rating === star.toString()}
                      className="hidden"
                    />
                    <span
                      className={`text-3xl transition-colors ${
                        star <= Number(values.rating)
                          ? "text-yellow-400"
                          : "text-gray-600 hover:text-yellow-200"
                      }`}
                    >
                      ★
                    </span>
                  </label>
                ))}
              </div>
              {errors.rating && touched.rating && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.rating}
                </span>
              )}
            </div>

            {/* Recommend Checkbox */}
            <div className="sm:col-span-2">
              <label
                htmlFor="recommend"
                className="flex items-center mb-5 cursor-pointer"
              >
                <input
                  id="recommend"
                  type="checkbox"
                  name="recommend"
                  checked={values.recommend}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-4 h-4 border border-gray-600 rounded bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                />
                <p className="ms-2 text-md font-medium text-white select-none">
                  Recommend this movie
                </p>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg duration-300 disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>

      {/* Reviews Display Section */}
      <div className="col-span-12 lg:col-span-6 p-6 lg:py-20 border-t lg:border-t-0 lg:border-l border-gray-800">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          🎬 User Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No reviews added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reviews.map((val, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
              >
                <div>
                  {/* Movie Title */}
                  <h3 className="text-2xl font-bold text-indigo-400 mb-3 break-words">
                    🎥 {val.title}
                  </h3>

                  {/* Rating Stars */}
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl ${
                          star <= Number(val.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-300 leading-relaxed mb-5 break-words">
                    {val.review}
                  </p>
                </div>

                {/* Recommendation Tag */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  {val.recommend ? (
                    <span className="bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm font-medium">
                      👍 Recommended
                    </span>
                  ) : (
                    <span className="bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-sm font-medium">
                      👎 Not Recommended
                    </span>
                  )}

                  <span className="text-gray-400 font-semibold">
                    {val.rating}/5 ⭐
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
