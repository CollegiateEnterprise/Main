import { useState } from 'react';
import { LoginSelect } from './components/LoginSelect';
import { StudentLogin } from './components/StudentLogin';
import { ProfessorLogin } from './components/ProfessorLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { ProfessorDashboard } from './components/ProfessorDashboard';
import { ProfessorCourses } from './components/ProfessorCourses';
import { ProfessorStudents } from './components/ProfessorStudents';
import { HomePage } from './components/HomePage';
import { ProfessorList } from './components/ProfessorList';
import { ProfessorDetail } from './components/ProfessorDetail';
import { WriteReview } from './components/WriteReview';
import { StudentProfile } from './components/StudentProfile';
import { Screen } from './types';

type UserRole = 'student' | 'professor' | null;
type LoginScreen = 'select' | 'student' | 'professor';

interface NavigationState {
  screen: Screen | 'student-dashboard' | 'professor-dashboard' | 'professor-courses' | 'professor-students';
  data?: any;
}

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loginScreen, setLoginScreen] = useState<LoginScreen>('select');
  const [userEmail, setUserEmail] = useState<string>('');
  const [navigation, setNavigation] = useState<NavigationState>({
    screen: 'student-dashboard',
  });
  const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>([]);

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'student') setLoginScreen('student');
    else if (role === 'professor') setLoginScreen('professor');
  };

  const handleLogin = (role: UserRole, email?: string) => {
    setUserRole(role);
    if (email) setUserEmail(email);
    setNavigationHistory([]);
    if (role === 'student') {
      setNavigation({ screen: 'student-dashboard' });
    } else if (role === 'professor') {
      setNavigation({ screen: 'professor-dashboard' });
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserEmail('');
    setLoginScreen('select');
    setNavigation({ screen: 'student-dashboard' });
    setNavigationHistory([]);
  };

  const handleNavigate = (screen: string, data?: any) => {
    let updatedCurrentNavigation = navigation;
    if (navigation.screen === 'student-dashboard' && data?.returnTab) {
      updatedCurrentNavigation = {
        ...navigation,
        data: { ...navigation.data, activeTab: data.returnTab }
      };
    }
    
    setNavigationHistory(prev => [...prev, updatedCurrentNavigation]);
    setNavigation({ screen: screen as any, data });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setNavigation(previous);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToRoleSelect = () => {
    setLoginScreen('select');
  };

  if (!userRole) {
    if (loginScreen === 'select') {
      return <LoginSelect onSelectRole={handleRoleSelect} />;
    }
    if (loginScreen === 'student') {
      return <StudentLogin onLogin={(email) => handleLogin('student', email)} onBack={handleBackToRoleSelect} />;
    }
    if (loginScreen === 'professor') {
      return <ProfessorLogin onLogin={() => handleLogin('professor')} onBack={handleBackToRoleSelect} />;
    }
  }

  return (
    <div className="min-h-screen">
      {userRole === 'student' && (
        <>
          {navigation.screen === 'student-dashboard' && (
            <StudentDashboard 
              onNavigate={handleNavigate} 
              onLogout={handleLogout}
              initialTab={navigation.data?.activeTab}
            />
          )}
          
          {navigation.screen === 'home' && (
            <HomePage onNavigate={handleNavigate} onBack={handleBack} />
          )}
          
          {navigation.screen === 'professor-list' && (
            <ProfessorList 
              onNavigate={handleNavigate}
              onBack={handleBack}
              initialSearch={navigation.data?.searchQuery || ''}
            />
          )}
          
          {navigation.screen === 'professor-detail' && navigation.data?.professorId && (
            <ProfessorDetail
              professorId={navigation.data.professorId}
              onNavigate={handleNavigate}
              onBack={handleBack}
              userRole={userRole}
            />
          )}
          
          {navigation.screen === 'write-review' && navigation.data?.professorId && (
            <WriteReview
              professorId={navigation.data.professorId}
              onNavigate={handleNavigate}
              onBack={handleBack}
            />
          )}
          
          {navigation.screen === 'profile' && (
            <StudentProfile 
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              onBack={handleBack}
              userEmail={userEmail}
            />
          )}
        </>
      )}

      {userRole === 'professor' && (
        <>
          {navigation.screen === 'professor-dashboard' && (
            <ProfessorDashboard onNavigate={handleNavigate} onLogout={handleLogout} />
          )}
          
          {navigation.screen === 'professor-courses' && (
            <ProfessorCourses
              onNavigate={handleNavigate}
              onBack={handleBack}
            />
          )}
          
          {navigation.screen === 'professor-students' && (
            <ProfessorStudents
              onNavigate={handleNavigate}
              onBack={handleBack}
            />
          )}
          
          {navigation.screen === 'professor-detail' && navigation.data?.professorId && (
            <ProfessorDetail
              professorId={navigation.data.professorId}
              onNavigate={handleNavigate}
              onBack={handleBack}
              userRole={userRole}
            />
          )}
          
          {navigation.screen === 'professor-list' && (
            <ProfessorList 
              onNavigate={handleNavigate}
              onBack={handleBack}
              initialSearch={navigation.data?.searchQuery || ''}
            />
          )}
        </>
      )}
    </div>
  );
}