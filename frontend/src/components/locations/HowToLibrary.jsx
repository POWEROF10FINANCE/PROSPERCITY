import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Clock, BarChart, ArrowLeft, ArrowRight, Tag, CheckCircle, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { ARTICLES, searchArticles, getCategories } from '../../logic/how-to-library.mjs';

const HowToLibrary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewArticle, setViewArticle] = useState(null);

  const categories = useMemo(() => getCategories(), []);
  
  const filteredArticles = useMemo(() => {
    if (searchQuery) {
      return searchArticles(searchQuery);
    }
    if (selectedCategory) {
      return ARTICLES.filter(a => a.category === selectedCategory);
    }
    return ARTICLES;
  }, [searchQuery, selectedCategory]);

  const handleMarkComplete = (articleId) => {
    if (!state.completedScenarios.includes(articleId)) {
      dispatch({ type: 'COMPLETE_SCENARIO', payload: articleId });
    }
  };

  if (viewArticle) {
    const isComplete = state.completedScenarios.includes(viewArticle.id);
    return (
      <div className="space-y-6 animate-slide-up">
        <header className="flex items-center justify-between">
          <button 
            onClick={() => setViewArticle(null)}
            className="flex items-center gap-1 text-green-700 font-bold hover:gap-2 transition-all"
          >
            <ArrowLeft size={20} /> Back to Library
          </button>
          <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            {viewArticle.category.replace('-', ' ')}
          </div>
        </header>

        <article className="max-w-3xl mx-auto">
          <div className="card-playful bg-white p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                viewArticle.difficulty === 'beginner' ? 'bg-green-100 text-green-600' : 
                viewArticle.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
              }`}>
                {viewArticle.difficulty}
              </div>
              <div className="flex items-center gap-1 text-gray-400 font-bold text-xs uppercase tracking-wider">
                <Clock size={14} /> {viewArticle.estimatedTime}
              </div>
            </div>

            <h1 className="text-4xl font-black text-green-900 mb-6 leading-tight">{viewArticle.title}</h1>
            <p className="text-xl font-bold text-gray-500 mb-8 italic leading-relaxed">"{viewArticle.summary}"</p>
            
            <div className="space-y-6">
              <h3 className="text-xl font-black text-green-800 uppercase tracking-tighter border-b-4 border-green-50 pb-2">Steps to Master</h3>
              {viewArticle.steps.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-black flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  <p className="font-bold text-gray-700 pt-2 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-amber-50 p-8 rounded-[2.5rem] border-2 border-amber-100 flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h4 className="font-black text-amber-900 mb-1">Penny's Pro Tip</h4>
                <p className="font-bold text-amber-800 italic">{viewArticle.tip}</p>
              </div>
            </div>

            <button 
              onClick={() => handleMarkComplete(viewArticle.id)}
              disabled={isComplete}
              className={`w-full mt-12 py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                isComplete 
                  ? 'bg-gray-100 text-gray-400 cursor-default' 
                  : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
              }`}
            >
              {isComplete ? <><CheckCircle /> MASTERED</> : <><Sparkles /> MARK AS COMPLETE (+2 STARS)</>}
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/game')}
          className="flex items-center gap-1 text-green-700 font-bold hover:gap-2 transition-all"
        >
          <ArrowLeft size={20} /> Back to Map
        </button>
        <div className="text-right">
          <h1 className="text-4xl font-black text-green-900 tracking-tight">How-To Library</h1>
          <p className="text-green-700 font-bold italic">Knowledge is Financial Power</p>
        </div>
      </header>

      {/* Search & Categories */}
      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search guides: 'dispute debt', 'budget', 'credit score'..."
            className="w-full bg-white border-4 border-green-50 rounded-[2.5rem] py-6 pl-16 pr-6 font-bold text-xl text-gray-800 outline-none focus:border-green-300 transition-all shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border-2 ${!selectedCategory ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-100 hover:border-green-200'}`}
          >
            ALL ARTICLES
          </button>
          {categories.map(cat => (
            <button 
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border-2 ${selectedCategory === cat.name ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-100 hover:border-green-200'}`}
            >
              {cat.name.replace('-', ' ')} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {filteredArticles.length > 0 ? filteredArticles.map((article) => {
          const isComplete = state.completedScenarios.includes(article.id);
          return (
            <div 
              key={article.id}
              onClick={() => setViewArticle(article)}
              className="card-playful bg-white p-6 cursor-pointer hover:-translate-y-2 transition-all group flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                  article.difficulty === 'beginner' ? 'bg-green-100 text-green-600' : 
                  article.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                  {article.difficulty}
                </div>
                {isComplete && <CheckCircle size={20} className="text-green-500" />}
              </div>
              
              <h3 className="text-2xl font-black text-gray-800 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">{article.title}</h3>
              <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-3 italic flex-grow">"{article.summary}"</p>
              
              <div className="pt-4 border-t-2 border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <Clock size={14} /> {article.estimatedTime.split(' ')[0]} READ
                </div>
                <ArrowRight size={20} className="text-green-400 group-hover:translate-x-2 transition-all" />
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center">
            <div className="text-6xl mb-4">🕵️</div>
            <h3 className="text-2xl font-black text-gray-400 italic">No guides found matching your search.</h3>
            <button onClick={() => {setSearchQuery(''); setSelectedCategory(null);}} className="mt-4 text-green-500 font-black uppercase tracking-widest underline">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

const Sparkles = () => (
  <span className="animate-pulse">✨</span>
);

export default HowToLibrary;
