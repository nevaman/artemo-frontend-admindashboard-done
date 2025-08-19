# Artemo AI Dashboard - Technical Architecture

## 🏗️ Technology Stack

### **Frontend Architecture**
- **React 19**: Latest React with concurrent features and improved performance
- **TypeScript**: Full type safety throughout the application
- **Vite**: Lightning-fast development server and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **React Markdown**: Rich text rendering for AI-generated content

### **Backend Infrastructure**
- **Supabase**: Complete backend-as-a-service platform
- **PostgreSQL**: Robust relational database with advanced features
- **Edge Functions**: Serverless functions for AI processing (Deno runtime)
- **Supabase Storage**: Secure file storage for knowledge base documents
- **Row Level Security (RLS)**: Database-level security policies

### **AI Integration**
- **Claude (Anthropic)**: Primary AI model for content generation  
- **OpenAI GPT-4**: Secondary AI model with automatic fallback support
- **Edge Function Processing**: Serverless AI API calls with intelligent failover

### **State Management**
- **Zustand**: Lightweight state management for authentication
- **React Hooks**: Custom hooks for data fetching and management
- **Local Storage**: Persistent client-side preferences and settings

## 🗄️ Database Schema

### **Core Tables**

#### **Authentication & Users**
```sql
-- user_profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  organization TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **Dynamic Tool System**
```sql
-- categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- tools
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  primary_model TEXT NOT NULL,
  fallback_models TEXT[] DEFAULT '{}',
  prompt_instructions TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- tool_questions
CREATE TABLE tool_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('input', 'textarea', 'select')),
  placeholder TEXT,
  required BOOLEAN DEFAULT false,
  question_order INTEGER NOT NULL,
  options TEXT[], -- For select type questions
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **User Data & Content**
```sql
-- projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- chat_sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES tools(id),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  session_data JSONB, -- Store messages and session state
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- knowledge_base_files
CREATE TABLE knowledge_base_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Row Level Security Policies**

#### **User Data Protection**
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users manage own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own chats" ON chat_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own files" ON knowledge_base_files
  FOR ALL USING (auth.uid() = user_id);
```

#### **Admin-Controlled Content**
```sql
-- Public read access, admin-only write access
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (active = true);

CREATE POLICY "Admins manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can view active tools" ON tools
  FOR SELECT USING (active = true);

CREATE POLICY "Admins manage tools" ON tools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 🔌 API Architecture

### **Supabase API Service**
```typescript
export class SupabaseApiService {
  // Tools Management
  async getTools(): Promise<ToolsApiResponse>
  async createTool(toolData: Omit<DynamicTool, 'id'>): Promise<ApiResponse<DynamicTool>>
  async updateTool(id: string, updates: Partial<DynamicTool>): Promise<ApiResponse<DynamicTool>>
  async deleteTool(id: string): Promise<ApiResponse<void>>

  // Categories Management  
  async getCategories(): Promise<CategoriesApiResponse>
  async createCategory(categoryData: Omit<AdminCategory, 'id'>): Promise<ApiResponse<AdminCategory>>
  async updateCategory(id: string, updates: Partial<AdminCategory>): Promise<ApiResponse<AdminCategory>>
  async deleteCategory(id: string): Promise<ApiResponse<void>>

  // AI Chat Integration
  async sendChatMessage(toolId: string, messages: Message[], knowledgeBase?: string): Promise<ApiResponse<string>>

  // User Data Management
  async getProjects(userId: string): Promise<ApiResponse<any[]>>
  async createProject(projectData: ProjectData): Promise<ApiResponse<any>>
  async saveChatSession(sessionData: ChatSessionData): Promise<ApiResponse<any>>
  async getChatSessions(userId: string): Promise<ApiResponse<any[]>>
}
```

### **Authentication Service**
```typescript
export class AuthService {
  // User Authentication
  async signUp(email: string, password: string, fullName: string)
  async signIn(email: string, password: string)
  async signOut()
  async getCurrentUser(): Promise<User | null>
  async getCurrentSession(): Promise<Session | null>

  // User Profile Management
  async getUserProfile(userId: string): Promise<UserProfile | null>
  async updateUserProfile(userId: string, updates: Partial<UserProfile>)
  async isAdmin(userId: string): Promise<boolean>

  // Security & Recovery
  async resetPassword(email: string)
  async updatePassword(newPassword: string)
  onAuthStateChange(callback: AuthChangeCallback)
}
```

### **File Storage Service**
```typescript
export class StorageService {
  // File Management
  async uploadFile(file: File, userId: string): Promise<FileUploadResponse>
  async getFileUrl(filePath: string): Promise<FileUrlResponse>
  async getFileContent(filePath: string): Promise<FileContentResponse>
  async deleteFile(fileId: string, userId: string): Promise<DeleteResponse>

  // Content Processing
  async processFileForAI(file: File): Promise<ProcessedContentResponse>
  validateFile(file: File): FileValidationResult
  
  // User File Management
  async getUserFiles(userId: string): Promise<UserFilesResponse>
}
```

## 🤖 AI Integration Architecture

### **Edge Function: AI Chat Processing**

#### **Function Structure**
```typescript
// supabase/functions/ai-chat/index.ts
serve(async (req) => {
  // 1. Parse request and validate tool
  const { toolId, messages, knowledgeBase } = await req.json()
  
  // 2. Fetch tool configuration from database
  const tool = await supabase.from('tools').select('*').eq('id', toolId).single()
  
  // 3. Build AI prompt with context
  const systemPrompt = buildPrompt(tool, messages, knowledgeBase)
  
  // 4. Call AI provider with fallback support
  const response = await callAIProvider(tool.primary_model, systemPrompt, userContext)
  
  // 5. Update usage analytics
  await updateToolUsage(toolId)
  
  // 6. Return formatted response
  return new Response(JSON.stringify({ response }))
})
```

#### **AI Provider Integration**
```typescript
// OpenAI Integration
async function callOpenAI(systemPrompt: string, userContext: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContext }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  })
  
  const data = await response.json()
  return data.choices[0].message.content
}

// Claude Integration
async function callAnthropic(systemPrompt: string, userContext: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY'),
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContext }]
    })
  })

  const data = await response.json()
  return data.content[0].text
}
```

## 🔄 Data Flow Architecture

### **User Interaction Flow**
```
User Action → React Component → Custom Hook → API Service → Supabase → Database
     ↓                                                           ↓
Response ← Component Update ← State Update ← API Response ← Query Result
```

### **Admin Tool Creation Flow**
```
Admin Creates Tool → AdminTools Component → API Service → Database
                                                    ↓
Tool Available → Users See Tool → Tool Selection → AI Edge Function
                                                          ↓
AI Response → Chat Interface → Save to Database → User Project/History
```

### **Authentication Flow**
```
User Login → AuthService → Supabase Auth → User Profile Fetch → Global State Update
                                                     ↓
Protected Routes → Role Checking → Admin Panel Access (if admin)
```

## 🛠️ Development & Build Process

### **Development Environment**
```bash
# Local Development
npm run dev              # Start Vite development server
npm run supabase:start   # Start local Supabase (Docker required)
npm run supabase:reset   # Reset local database

# Database Management
supabase db push         # Deploy schema changes
supabase db reset        # Reset to clean state
supabase functions deploy ai-chat  # Deploy Edge Function
```

### **Production Build**
```bash
# Build Process
npm run build           # Create production build
npm run preview         # Preview production build locally

# Environment Variables
VITE_SUPABASE_URL=production_url
VITE_SUPABASE_ANON_KEY=production_key
OPENAI_API_KEY=production_openai_key
ANTHROPIC_API_KEY=production_anthropic_key
```

### **Deployment Architecture**
- **Frontend**: Deployed to Vercel/Netlify with environment variables
- **Backend**: Supabase cloud infrastructure
- **Edge Functions**: Auto-deployed to Supabase Edge Runtime
- **Database**: PostgreSQL on Supabase cloud
- **Storage**: Supabase Storage for knowledge base files

## 🔒 Security Implementation

### **Authentication Security**
- **JWT Tokens**: Secure session management via Supabase Auth
- **Role-Based Access**: Granular permissions with database-level enforcement
- **Session Validation**: Automatic token refresh and validation

### **Data Security**
- **Row Level Security**: Database-level data isolation
- **API Security**: Protected endpoints with authentication middleware
- **File Security**: Secure file upload with validation and virus scanning

### **Infrastructure Security**
- **HTTPS Only**: All communications encrypted in transit
- **Environment Variables**: Secure handling of API keys and secrets
- **Database Encryption**: Data encrypted at rest in Supabase

## 📊 Performance & Monitoring

### **Performance Optimization**
- **Code Splitting**: Lazy loading of admin components
- **Bundle Optimization**: Vite-powered build optimization
- **Caching Strategy**: Intelligent data caching for improved performance
- **Edge Computing**: AI processing at edge locations for reduced latency

### **Monitoring & Analytics**
- **Error Tracking**: Comprehensive error boundary implementation
- **Usage Analytics**: Tool and feature usage tracking
- **Performance Metrics**: Core Web Vitals monitoring
- **Database Monitoring**: Query performance and optimization

This technical architecture ensures Artemo AI Dashboard is scalable, secure, and maintainable while providing excellent performance for both users and administrators.
