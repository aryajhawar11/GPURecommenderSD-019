// Header component
const Header = ({ darkMode }) => {
    return (
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-purple-600">GPU</span><span className="text-teal-500"> Recommender</span>
        </h1>
        <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Find the perfect GPU for your workload. Compare performance, costs, and specifications to make informed decisions for your cloud infrastructure.
        </p>
      </div>
    );
  };

export default Header;