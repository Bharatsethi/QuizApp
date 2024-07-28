import React, { createContext, useState } from 'react';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [currentQuizId, setCurrentQuizId] = useState(null);

  return (
    <NavigationContext.Provider value={{
      currentPlanId, setCurrentPlanId,
      currentChapterId, setCurrentChapterId,
      currentLessonId, setCurrentLessonId,
      currentTopicId, setCurrentTopicId,
      currentQuizId, setCurrentQuizId
    }}>
      {children}
    </NavigationContext.Provider>
  );
};
