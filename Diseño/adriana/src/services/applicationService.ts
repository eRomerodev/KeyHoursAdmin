// Servicio simple para gestión de aplicaciones
export interface Application {
  id: number;
  project_id: number;
  project_name: string;
  user_name: string;
  user_carnet: string;
  status: 'pending' | 'approved' | 'rejected';
  motivation: string;
  available_hours_per_week: number;
  start_date_preference: string;
  applied_at: string;
}

export interface CreateApplicationData {
  project_id: number;
  project_name: string;
  motivation: string;
  hours_per_week: number;
  start_date: string;
}

class ApplicationService {
  private applications: Application[] = [];
  private nextId = 1;

  constructor() {
    // Inicializar con datos de ejemplo si no hay datos guardados
    const stored = localStorage.getItem('applications');
    if (!stored) {
      this.initializeWithSampleData();
    } else {
      this.applications = JSON.parse(stored);
      // Actualizar nextId basado en el último ID
      if (this.applications.length > 0) {
        this.nextId = Math.max(...this.applications.map(app => app.id)) + 1;
      }
    }
  }

  private initializeWithSampleData() {
    const sampleApplications: Application[] = [
      {
        id: 1,
        project_id: 1,
        project_name: "Proyecto de Limpieza de Playa",
        user_name: "Ana García",
        user_carnet: "20230001",
        status: "pending",
        motivation: "Me interesa mucho contribuir al cuidado del medio ambiente y creo que este proyecto me permitirá hacer una diferencia real en mi comunidad.",
        available_hours_per_week: 8,
        start_date_preference: "2024-01-15",
        applied_at: new Date().toISOString()
      },
      {
        id: 2,
        project_id: 1,
        project_name: "Proyecto de Limpieza de Playa",
        user_name: "Carlos López",
        user_carnet: "20230002",
        status: "pending",
        motivation: "Siempre he querido participar en actividades de voluntariado y este proyecto parece perfecto para empezar.",
        available_hours_per_week: 6,
        start_date_preference: "2024-01-20",
        applied_at: new Date().toISOString()
      },
      {
        id: 3,
        project_id: 2,
        project_name: "Tutoring para Estudiantes",
        user_name: "María Rodríguez",
        user_carnet: "20230003",
        status: "approved",
        motivation: "Me encanta enseñar y ayudar a otros estudiantes. Tengo experiencia en matemáticas y ciencias.",
        available_hours_per_week: 10,
        start_date_preference: "2024-01-10",
        applied_at: new Date().toISOString()
      }
    ];
    
    this.applications = sampleApplications;
    localStorage.setItem('applications', JSON.stringify(this.applications));
  }

  async createApplication(data: CreateApplicationData): Promise<Application> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));

    // Obtener información del usuario actual
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const application: Application = {
      id: this.nextId++,
      project_id: data.project_id,
      project_name: data.project_name,
      user_name: user.full_name || 'Usuario',
      user_carnet: user.carnet || 'N/A',
      status: 'pending',
      motivation: data.motivation,
      available_hours_per_week: data.hours_per_week,
      start_date_preference: data.start_date,
      applied_at: new Date().toISOString()
    };

    this.applications.push(application);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('applications', JSON.stringify(this.applications));
    
    console.log('✅ Aplicación creada:', application);
    return application;
  }

  async getMyApplications(): Promise<Application[]> {
    // Cargar desde localStorage
    const stored = localStorage.getItem('applications');
    if (stored) {
      this.applications = JSON.parse(stored);
    }
    
    return this.applications;
  }

  async getProjectApplications(projectId: number): Promise<Application[]> {
    // Cargar desde localStorage
    const stored = localStorage.getItem('applications');
    if (stored) {
      this.applications = JSON.parse(stored);
    }
    
    return this.applications.filter(app => app.project_id === projectId);
  }

  async getAllApplications(): Promise<Application[]> {
    // Cargar desde localStorage
    const stored = localStorage.getItem('applications');
    if (stored) {
      this.applications = JSON.parse(stored);
    }
    
    return this.applications;
  }

  hasAppliedToProject(projectId: number): boolean {
    return this.applications.some(app => app.project_id === projectId);
  }

  getApplicationStatus(projectId: number): 'available' | 'applied' | 'approved' | 'rejected' {
    const application = this.applications.find(app => app.project_id === projectId);
    if (!application) return 'available';
    
    switch (application.status) {
      case 'pending': return 'applied';
      case 'approved': return 'approved';
      case 'rejected': return 'rejected';
      default: return 'available';
    }
  }

  async reviewApplication(applicationId: number, status: 'approved' | 'rejected'): Promise<Application> {
    const application = this.applications.find(app => app.id === applicationId);
    if (!application) {
      throw new Error('Aplicación no encontrada');
    }
    
    application.status = status;
    localStorage.setItem('applications', JSON.stringify(this.applications));
    
    return application;
  }
}

export const applicationService = new ApplicationService();
