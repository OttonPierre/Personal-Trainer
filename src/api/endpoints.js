import { api } from './client';

// Auth
export const login = (data) => api.post('/auth/login/', data);
export const cadastro = (data) => api.post('/auth/cadastro/', data);
export const getEu = () => api.get('/auth/eu/');
export const alterarSenha = (data) => api.post('/auth/alterar-senha/', data);
export const redefinirSenha = (data) => api.post('/auth/redefinir-senha/', data);
export const patchEu = (data) => api.patch('/auth/eu/', data);

// Organização
export const getOrganizacao = () => api.get('/organizacao/');
export const patchOrganizacao = (data) => api.patch('/organizacao/', data);

// Recursos (Personais)
export const getRecursos = (params = '') => api.get(`/recursos/${params}`);
export const getRecurso = (id) => api.get(`/recursos/${id}/`);
export const postRecurso = (data) => api.post('/recursos/', data);
export const patchRecurso = (id, data) => api.patch(`/recursos/${id}/`, data);

// Serviços
export const getServicos = (params = '') => api.get(`/servicos/${params}`);
export const getServico = (id) => api.get(`/servicos/${id}/`);
export const postServico = (data) => api.post('/servicos/', data);
export const patchServico = (id, data) => api.patch(`/servicos/${id}/`, data);

// Disponibilidades
export const getDisponibilidades = (recursoId) =>
  api.get(`/disponibilidades/?recurso=${recursoId}`);
export const postDisponibilidade = (data) => api.post('/disponibilidades/', data);
export const patchDisponibilidade = (id, data) => api.patch(`/disponibilidades/${id}/`, data);
export const deleteDisponibilidade = (id) => api.delete(`/disponibilidades/${id}/`);

// Horários livres
export const getHorariosLivres = (params) => api.get(`/horarios-livres/?${params}`);

// Agendamentos
export const getAgendamentos = (params = '') => api.get(`/agendamentos/${params}`);
export const getAgendamento = (id) => api.get(`/agendamentos/${id}/`);
export const postAgendamento = (data) => api.post('/agendamentos/', data);
export const confirmarAgendamento = (id) => api.post(`/agendamentos/${id}/confirmar/`);
export const concluirAgendamento = (id) => api.post(`/agendamentos/${id}/concluir/`);
export const cancelarAgendamento = (id) => api.post(`/agendamentos/${id}/cancelar/`);
export const avaliarAgendamento = (id, data) => api.post(`/agendamentos/${id}/avaliar/`, data);

// Avaliações
export const getAvaliacoes = (params = '') => api.get(`/avaliacoes/${params}`);
