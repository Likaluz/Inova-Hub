import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ExternalLink,
  FileText,
  Lightbulb,
  LogOut,
  Medal,
  MessageSquare,
  Plus,
  RefreshCw,
  Rocket,
  Send,
  Sparkles,
  Trophy,
  Trash2,
  Video,
  Users
} from 'lucide-react';

const API_URL = window.location.origin;
const STATIC_MODE = !['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);

const navItems = [
  { id: 'dashboard', label: 'Painel', icon: Rocket },
  { id: 'courses', label: 'Cursos', icon: BookOpen },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'ranking', label: 'Ranking', icon: Trophy }
];

function getInitialRoute() {
  if (STATIC_MODE) {
    const hashRoute = window.location.hash.replace('#/', '').replace('#', '');
    if (['dashboard', 'courses', 'chat', 'ranking'].includes(hashRoute)) return hashRoute;
  }

  const path = window.location.pathname.replace('/', '');
  if (['dashboard', 'courses', 'chat', 'ranking'].includes(path)) return path;
  return localStorage.getItem('inovahubUserId') ? 'dashboard' : 'home';
}

const defaultCourses = [
  {
    id: 'course-pdf-innovation',
    title: 'Guia rápido de inovação',
    type: 'pdf',
    url: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/transformacaodigital/arquivosinovacao/guia-orientativo-inovacao.pdf',
    description: 'Material introdutório para organizar problemas, ideias e oportunidades.'
  },
  {
    id: 'course-video-design-thinking',
    title: 'Design thinking na prática',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=_r0VX-aU_T8',
    description: 'Vídeo para apoiar ideação, empatia e prototipagem de soluções.'
  }
];

function loadCourses() {
  const savedCourses = localStorage.getItem('inovahubCourses');
  if (!savedCourses) return defaultCourses;

  try {
    const parsed = JSON.parse(savedCourses);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultCourses;
  } catch {
    return defaultCourses;
  }
}

function readJsonStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureStaticSeed() {
  if (!localStorage.getItem('inovahubStaticUsers')) {
    writeJsonStorage('inovahubStaticUsers', []);
  }

  if (!localStorage.getItem('inovahubStaticIdeas')) {
    writeJsonStorage('inovahubStaticIdeas', []);
  }

  if (!localStorage.getItem('inovahubStaticMissions')) {
    writeJsonStorage('inovahubStaticMissions', [
      {
        id: 1,
        title: 'Enviar uma ideia de inovação',
        points: 10,
        active: 1
      }
    ]);
  }
}

function chatAnswer(message) {
  const text = message.toLowerCase();

  if (text.includes('ideia')) {
    return 'Para cadastrar uma ideia, acesse o painel, preencha título e descrição e envie. Cada ideia soma 10 pontos.';
  }

  if (text.includes('miss')) {
    return 'As missões ficam no dashboard. Você pode concluir uma missão para ganhar pontos ou criar novas atividades.';
  }

  if (text.includes('curso') || text.includes('pdf') || text.includes('video')) {
    return 'Na aba Cursos, você pode adicionar materiais em PDF ou vídeo por link e abrir cada conteúdo em uma nova guia.';
  }

  return 'Você pode participar cadastrando ideias, concluindo missões, acompanhando o ranking e estudando os cursos disponíveis.';
}

async function staticRequest(path, options = {}) {
  ensureStaticSeed();

  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};
  const users = readJsonStorage('inovahubStaticUsers', []);
  const ideas = readJsonStorage('inovahubStaticIdeas', []);
  const missions = readJsonStorage('inovahubStaticMissions', []);

  if (path === '/api/users' && method === 'GET') {
    return [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (path === '/api/users' && method === 'POST') {
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!name) throw new Error('Nome é obrigatório.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      throw new Error('Digite um e-mail válido.');
    }
    if (users.some((user) => user.email === email)) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const user = {
      id: users.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      name,
      email,
      points: 0,
      created_at: new Date().toISOString()
    };
    writeJsonStorage('inovahubStaticUsers', [user, ...users]);
    return user;
  }

  if (path === '/api/ideas' && method === 'GET') {
    return ideas
      .map((idea) => ({
        ...idea,
        user_name: users.find((user) => user.id === idea.user_id)?.name || idea.user_id
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  if (path === '/api/ideas' && method === 'POST') {
    if (!body.userId || !body.title || !body.description) {
      throw new Error('userId, title e description são obrigatórios.');
    }

    const idea = {
      id: ideas.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      user_id: Number(body.userId),
      title: body.title,
      description: body.description,
      status: 'ENVIADA',
      created_at: new Date().toISOString()
    };
    writeJsonStorage('inovahubStaticIdeas', [idea, ...ideas]);
    writeJsonStorage(
      'inovahubStaticUsers',
      users.map((user) => user.id === Number(body.userId) ? { ...user, points: Number(user.points || 0) + 10 } : user)
    );
    return idea;
  }

  if (path === '/api/missions' && method === 'GET') {
    return missions.filter((mission) => mission.active === 1).sort((a, b) => a.id - b.id);
  }

  if (path === '/api/missions' && method === 'POST') {
    const title = body.title?.trim();
    const points = Number(body.points);

    if (!title) throw new Error('Título da missão é obrigatório.');
    if (!Number.isInteger(points) || points <= 0) {
      throw new Error('Pontos da missão devem ser um número inteiro maior que zero.');
    }

    const mission = {
      id: missions.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      title,
      points,
      active: 1
    };
    writeJsonStorage('inovahubStaticMissions', [...missions, mission]);
    return mission;
  }

  const completeMatch = path.match(/^\/api\/missions\/(\d+)\/complete$/);
  if (completeMatch && method === 'POST') {
    const missionId = Number(completeMatch[1]);
    const mission = missions.find((item) => item.id === missionId && item.active === 1);

    if (!mission) throw new Error('Missão não encontrada.');

    const updatedUsers = users.map((user) =>
      user.id === Number(body.userId) ? { ...user, points: Number(user.points || 0) + mission.points } : user
    );
    const updatedUser = updatedUsers.find((user) => user.id === Number(body.userId));
    writeJsonStorage('inovahubStaticUsers', updatedUsers);

    return {
      message: 'Missão concluída.',
      pointsAdded: mission.points,
      user: updatedUser
    };
  }

  const deleteMatch = path.match(/^\/api\/missions\/(\d+)$/);
  if (deleteMatch && method === 'DELETE') {
    const missionId = Number(deleteMatch[1]);
    const mission = missions.find((item) => item.id === missionId && item.active === 1);

    if (!mission) throw new Error('Missão não encontrada.');

    writeJsonStorage(
      'inovahubStaticMissions',
      missions.map((item) => item.id === missionId ? { ...item, active: 0 } : item)
    );

    return {
      message: 'Missão excluída.',
      missionId
    };
  }

  if (path === '/api/chat' && method === 'POST') {
    if (!body.message) throw new Error('Mensagem é obrigatória.');
    return { answer: chatAnswer(body.message) };
  }

  throw new Error('Recurso não disponível no modo GitHub Pages.');
}

async function request(path, options) {
  if (STATIC_MODE) {
    return staticRequest(path, options);
  }

  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || 'Não foi possível concluir a operação.');
  }

  return data;
}

function StatusMessage({ message }) {
  if (!message?.text) return null;
  return <div className={`notice notice-${message.type || 'ok'}`}>{message.text}</div>;
}

function EmptyState({ children }) {
  return <div className="empty-state">{children}</div>;
}

function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [missions, setMissions] = useState([]);
  const [courses, setCourses] = useState(loadCourses);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('inovahubUserId');

  const navigate = (nextRoute) => {
    setRoute(nextRoute);

    if (STATIC_MODE) {
      window.location.hash = nextRoute === 'home' ? '' : `/${nextRoute}`;
      return;
    }

    const path = nextRoute === 'home' ? '/' : `/${nextRoute}`;
    window.history.pushState({}, '', path);
  };

  const refreshData = async () => {
    const storedUserId = localStorage.getItem('inovahubUserId');
    setLoading(true);

    try {
      const [allUsers, allIdeas, allMissions] = await Promise.all([
        request('/api/users'),
        request('/api/ideas'),
        request('/api/missions')
      ]);

      setUsers(allUsers);
      setIdeas(allIdeas);
      setMissions(allMissions);

      const user = allUsers.find((item) => String(item.id) === String(storedUserId));
      setCurrentUser(user || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onPopState = () => setRoute(getInitialRoute());
    const onHashChange = () => setRoute(getInitialRoute());
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  useEffect(() => {
    if (route !== 'home' && !userId) {
      navigate('home');
      return;
    }

    if (userId) {
      refreshData().catch(() => {});
    }
  }, [route, userId]);

  const stats = useMemo(() => {
    const totalPoints = users.reduce((sum, item) => sum + Number(item.points || 0), 0);
    return [
      { label: 'Participantes', value: users.length, icon: Users },
      { label: 'Ideias enviadas', value: ideas.length, icon: Lightbulb },
      { label: 'Missões ativas', value: missions.length, icon: CheckCircle2 },
      { label: 'Cursos', value: courses.length, icon: BookOpen },
      { label: 'Pontos gerados', value: totalPoints, icon: Sparkles }
    ];
  }, [users, ideas, missions, courses]);

  const saveCourses = (nextCourses) => {
    setCourses(nextCourses);
    localStorage.setItem('inovahubCourses', JSON.stringify(nextCourses));
  };

  const signOut = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate('home');
  };

  if (route === 'home') {
    return <Home onLoggedIn={() => navigate('dashboard')} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand-button" onClick={() => navigate('dashboard')} type="button">
          <span className="brand-mark">IH</span>
          <span>
            <strong>Inova Hub</strong>
            <small>Laboratório de ideias</small>
          </span>
        </button>

        <nav className="side-nav" aria-label="Navegação principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={route === item.id ? 'active' : ''}
                key={item.id}
                onClick={() => navigate(item.id)}
                type="button"
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="profile-panel">
          <span>{currentUser?.name || 'Usuário'}</span>
          <strong>{currentUser?.points || 0} pts</strong>
          <button onClick={signOut} type="button" aria-label="Sair">
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <span className="eyebrow">Programa de inovação</span>
            <h1>
              {route === 'dashboard'
                ? 'Painel de participação'
                : route === 'courses'
                  ? 'Cursos'
                  : route === 'chat'
                    ? 'Assistente Inova'
                    : 'Ranking'}
            </h1>
          </div>
          <button className="icon-button" onClick={refreshData} type="button" title="Atualizar dados">
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>
        </header>

        {route === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            ideas={ideas}
            missions={missions}
            onRefresh={refreshData}
            stats={stats}
          />
        )}
        {route === 'courses' && <Courses courses={courses} onChange={saveCourses} />}
        {route === 'chat' && <Chat />}
        {route === 'ranking' && <Ranking users={users} onRefresh={refreshData} />}
      </main>
    </div>
  );
}

function Home({ onLoggedIn }) {
  const [mode, setMode] = useState('register');
  const [registerForm, setRegisterForm] = useState({ name: '', email: '' });
  const [loginId, setLoginId] = useState('');
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const saveSession = (user) => {
    localStorage.setItem('inovahubUserId', user.id);
    localStorage.setItem('inovahubUserName', user.name);
    localStorage.setItem('inovahubPoints', user.points || 0);
  };

  const register = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage({ type: 'info', text: 'Criando seu espaço de inovação...' });

    try {
      const user = await request('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });

      saveSession(user);
      setMessage({ type: 'ok', text: `Cadastro pronto. Seu ID é ${user.id}.` });
      setTimeout(onLoggedIn, 450);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const login = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage({ type: 'info', text: 'Validando o ID informado...' });

    try {
      const users = await request('/api/users');
      const user = users.find((item) => String(item.id) === String(loginId));
      if (!user) throw new Error('Usuário não encontrado. Confira o ID ou faça um novo cadastro.');

      saveSession(user);
      setMessage({ type: 'ok', text: 'Login realizado. Entrando no painel...' });
      setTimeout(onLoggedIn, 450);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="hero-content">
          <span className="brand-mark large">IH</span>
          <p className="eyebrow">Inova Hub</p>
          <h1>Transforme ideias soltas em desafios, pontos e impacto visível.</h1>
          <p>
            Uma experiência React para cadastrar participantes, registrar ideias, completar missões e acompanhar quem mais move a inovação.
          </p>
          <div className="hero-metrics">
            <span><strong>+10</strong> pontos por ideia</span>
            <span><strong>Top 10</strong> ranking ativo</span>
            <span><strong>24h</strong> pronto para testar</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="segmented-control" role="tablist" aria-label="Acesso">
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')} type="button">
            Cadastro
          </button>
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">
            Login
          </button>
        </div>

        {mode === 'register' ? (
          <form onSubmit={register}>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })}
              placeholder="Ex.: Ana Souza"
              required
              value={registerForm.name}
            />
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
              placeholder="ana@email.com"
              required
              type="email"
              value={registerForm.email}
            />
            <button className="primary-button" disabled={busy} type="submit">
              Criar conta <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={login}>
            <label htmlFor="loginId">ID do usuário</label>
            <input
              id="loginId"
              min="1"
              onChange={(event) => setLoginId(event.target.value)}
              placeholder="Ex.: 1"
              required
              type="number"
              value={loginId}
            />
            <button className="primary-button" disabled={busy} type="submit">
              Entrar <ArrowRight size={18} />
            </button>
          </form>
        )}

        <StatusMessage message={message} />
        <a className="swagger-link" href="/api-docs">Abrir documentação Swagger</a>
      </section>
    </main>
  );
}

function Dashboard({ currentUser, ideas, missions, onRefresh, stats }) {
  const [ideaForm, setIdeaForm] = useState({ title: '', description: '' });
  const [missionForm, setMissionForm] = useState({ title: '', points: '' });
  const [ideaMessage, setIdeaMessage] = useState(null);
  const [missionMessage, setMissionMessage] = useState(null);
  const [createMissionMessage, setCreateMissionMessage] = useState(null);

  const createIdea = async (event) => {
    event.preventDefault();
    try {
      await request('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: Number(localStorage.getItem('inovahubUserId')),
          title: ideaForm.title,
          description: ideaForm.description
        })
      });
      setIdeaForm({ title: '', description: '' });
      setIdeaMessage({ type: 'ok', text: 'Ideia cadastrada. Você ganhou 10 pontos.' });
      await onRefresh();
    } catch (error) {
      setIdeaMessage({ type: 'error', text: error.message });
    }
  };

  const createMission = async (event) => {
    event.preventDefault();
    try {
      const mission = await request('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: missionForm.title, points: Number(missionForm.points) })
      });
      setMissionForm({ title: '', points: '' });
      setCreateMissionMessage({ type: 'ok', text: `Missão "${mission.title}" cadastrada.` });
      await onRefresh();
    } catch (error) {
      setCreateMissionMessage({ type: 'error', text: error.message });
    }
  };

  const completeMission = async (missionId) => {
    try {
      const data = await request(`/api/missions/${missionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: Number(localStorage.getItem('inovahubUserId')) })
      });
      setMissionMessage({ type: 'ok', text: `${data.message} +${data.pointsAdded} pontos.` });
      await onRefresh();
    } catch (error) {
      setMissionMessage({ type: 'error', text: error.message });
    }
  };

  const deleteMission = async (missionId) => {
    try {
      const data = await request(`/api/missions/${missionId}`, {
        method: 'DELETE'
      });
      setMissionMessage({ type: 'info', text: data.message });
      await onRefresh();
    } catch (error) {
      setMissionMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="dashboard-grid">
      <section className="hero-strip">
        <div>
          <span className="eyebrow">Bem-vindo</span>
          <h2>{currentUser?.name || 'Participante'}</h2>
          <p>ID {currentUser?.id || '-'} · {currentUser?.points || 0} pontos acumulados</p>
        </div>
        <Sparkles size={42} />
      </section>

      <section className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="stat-card" key={stat.label}>
              <Icon size={20} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          );
        })}
      </section>

      <section className="workspace-grid">
        <article className="panel">
          <div className="panel-title">
            <Lightbulb size={20} />
            <h3>Nova ideia</h3>
          </div>
          <form onSubmit={createIdea}>
            <label htmlFor="ideaTitle">Título</label>
            <input
              id="ideaTitle"
              onChange={(event) => setIdeaForm({ ...ideaForm, title: event.target.value })}
              placeholder="Ex.: Portal de sugestões"
              required
              value={ideaForm.title}
            />
            <label htmlFor="ideaDescription">Descrição</label>
            <textarea
              id="ideaDescription"
              onChange={(event) => setIdeaForm({ ...ideaForm, description: event.target.value })}
              placeholder="Descreva o problema, a solução e o impacto esperado"
              required
              value={ideaForm.description}
            />
            <button className="primary-button" type="submit">
              Enviar ideia <Plus size={18} />
            </button>
          </form>
          <StatusMessage message={ideaMessage} />
        </article>

        <article className="panel">
          <div className="panel-title">
            <CheckCircle2 size={20} />
            <h3>Missões</h3>
          </div>
          <form className="mission-form" onSubmit={createMission}>
            <input
              onChange={(event) => setMissionForm({ ...missionForm, title: event.target.value })}
              placeholder="Título da missão"
              required
              value={missionForm.title}
            />
            <input
              min="1"
              onChange={(event) => setMissionForm({ ...missionForm, points: event.target.value })}
              placeholder="Pontos"
              required
              type="number"
              value={missionForm.points}
            />
            <button className="icon-button strong" type="submit" title="Cadastrar missão">
              <Plus size={18} />
            </button>
          </form>
          <StatusMessage message={createMissionMessage} />

          <div className="mission-list">
            {missions.length ? missions.map((mission) => (
              <div className="mission-row" key={mission.id}>
                <div>
                  <strong>{mission.title}</strong>
                  <span>{mission.points} pontos</span>
                </div>
                <div className="mission-actions">
                  <button onClick={() => completeMission(mission.id)} type="button">
                    Concluir
                  </button>
                  <button
                    className="ghost-button danger"
                    onClick={() => deleteMission(mission.id)}
                    title="Excluir missão"
                    type="button"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            )) : <EmptyState>Nenhuma missão ativa.</EmptyState>}
          </div>
          <StatusMessage message={missionMessage} />
        </article>
      </section>

      <section className="panel full-width">
        <div className="panel-title">
          <Rocket size={20} />
          <h3>Ideias cadastradas</h3>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {ideas.length ? ideas.map((idea) => (
                <tr key={idea.id}>
                  <td>{idea.title}</td>
                  <td>{idea.user_name || idea.user_id}</td>
                  <td><span className="status-pill">{idea.status}</span></td>
                  <td>{new Date(idea.created_at).toLocaleString('pt-BR')}</td>
                </tr>
              )) : (
                <tr><td colSpan="4">Nenhuma ideia cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Courses({ courses, onChange }) {
  const [form, setForm] = useState({
    title: '',
    type: 'video',
    url: '',
    description: ''
  });
  const [message, setMessage] = useState(null);

  const createCourse = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const url = form.url.trim();

    if (!title || !url) {
      setMessage({ type: 'error', text: 'Informe título e link do curso.' });
      return;
    }

    const nextCourse = {
      id: `course-${Date.now()}`,
      title,
      type: form.type,
      url,
      description: form.description.trim() || 'Material de aprendizagem do Inova Hub.'
    };

    onChange([nextCourse, ...courses]);
    setForm({ title: '', type: 'video', url: '', description: '' });
    setMessage({ type: 'ok', text: 'Curso adicionado à biblioteca.' });
  };

  const removeCourse = (courseId) => {
    onChange(courses.filter((course) => course.id !== courseId));
    setMessage({ type: 'info', text: 'Curso removido da biblioteca.' });
  };

  return (
    <section className="courses-layout">
      <article className="panel course-form-panel">
        <div className="panel-title">
          <BookOpen size={20} />
          <h3>Novo curso</h3>
        </div>

        <form onSubmit={createCourse}>
          <label htmlFor="courseTitle">Título</label>
          <input
            id="courseTitle"
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Ex.: Introdução à inovação"
            required
            value={form.title}
          />

          <label htmlFor="courseType">Tipo de material</label>
          <select
            id="courseType"
            onChange={(event) => setForm({ ...form, type: event.target.value })}
            value={form.type}
          >
            <option value="video">Vídeo</option>
            <option value="pdf">PDF</option>
          </select>

          <label htmlFor="courseUrl">Link do PDF ou vídeo</label>
          <input
            id="courseUrl"
            onChange={(event) => setForm({ ...form, url: event.target.value })}
            placeholder="https://..."
            required
            type="url"
            value={form.url}
          />

          <label htmlFor="courseDescription">Descrição</label>
          <textarea
            id="courseDescription"
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Resumo do conteúdo e objetivo do curso"
            value={form.description}
          />

          <button className="primary-button" type="submit">
            Adicionar curso <Plus size={18} />
          </button>
        </form>
        <StatusMessage message={message} />
      </article>

      <div className="course-library">
        {courses.length ? courses.map((course) => {
          const TypeIcon = course.type === 'pdf' ? FileText : Video;
          return (
            <article className="course-card" key={course.id}>
              <div className={`course-media ${course.type}`}>
                <TypeIcon size={34} />
                <span>{course.type === 'pdf' ? 'PDF' : 'Vídeo'}</span>
              </div>
              <div className="course-content">
                <span className="course-type">{course.type === 'pdf' ? 'Leitura' : 'Aula em vídeo'}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-actions">
                  <a className="secondary-button" href={course.url} rel="noreferrer" target="_blank">
                    Abrir <ExternalLink size={16} />
                  </a>
                  <button className="ghost-button" onClick={() => removeCourse(course.id)} type="button" title="Remover curso">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </article>
          );
        }) : (
          <EmptyState>Nenhum curso cadastrado.</EmptyState>
        )}
      </div>
    </section>
  );
}

function Chat() {
  const [messages, setMessages] = useState([
    { from: 'assistant', text: 'Olá. Posso ajudar com ideias, missões e formas de participar do programa.' }
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const send = async (event) => {
    event.preventDefault();
    const message = input.trim();
    if (!message) return;

    setMessages((items) => [...items, { from: 'user', text: message }]);
    setInput('');
    setError(null);

    try {
      const data = await request('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      setMessages((items) => [...items, { from: 'assistant', text: data.answer }]);
    } catch (err) {
      setError({ type: 'error', text: err.message });
    }
  };

  return (
    <section className="chat-layout">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div className={`bubble ${message.from}`} key={`${message.from}-${index}`}>
            {message.from === 'assistant' && <Bot size={18} />}
            <span>{message.text}</span>
          </div>
        ))}
      </div>
      <form className="chat-composer" onSubmit={send}>
        <input
          onChange={(event) => setInput(event.target.value)}
          placeholder="Pergunte como participar, pontuar ou cadastrar ideias"
          value={input}
        />
        <button className="primary-button" type="submit">
          Enviar <Send size={18} />
        </button>
      </form>
      <StatusMessage message={error} />
    </section>
  );
}

function Ranking({ users, onRefresh }) {
  const orderedUsers = [...users].sort((a, b) => Number(b.points || 0) - Number(a.points || 0));

  return (
    <section className="panel full-width ranking-panel">
      <div className="panel-title spread">
        <div>
          <Medal size={21} />
          <h3>Top participantes</h3>
        </div>
        <button className="secondary-button" onClick={onRefresh} type="button">
          Atualizar
        </button>
      </div>

      <div className="ranking-list">
        {orderedUsers.length ? orderedUsers.map((user, index) => (
          <article className="ranking-row" key={user.id}>
            <span className="position">{index + 1}</span>
            <div>
              <strong>{user.name}</strong>
              <small>ID {user.id}</small>
            </div>
            <b>{user.points} pts</b>
          </article>
        )) : <EmptyState>Nenhum usuário cadastrado.</EmptyState>}
      </div>
    </section>
  );
}

export default App;
