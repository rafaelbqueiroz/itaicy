# Página "Experiências & Atividades" - Documentação

## 📋 Visão Geral

A página de Experiências & Atividades foi completamente redesenhada seguindo o template fornecido, oferecendo uma experiência de usuário moderna e intuitiva para descobrir e reservar atividades no Pantanal.

## 🎨 Estrutura da Página

### 1. **Hero Principal**
- **Dimensões:** 1920×800px (placeholder)
- **Overlay:** Verde pantanal com 40% de opacidade
- **Título (H1):** "Experiências Únicas no Pantanal"
- **Subtítulo (H2):** "Conecte-se com a natureza através de aventuras autênticas e inesquecíveis"
- **CTA Principal:** "Reserve sua Experiência" (scroll suave para grid)

### 2. **Filtro e Busca**
- **Dropdown Categoria:** Pesca, Ecoturismo, Contemplativo, Aventura
- **Input Data:** Seletor de data preferida
- **Input Pessoas:** Número de participantes (1-20)
- **Botão Filtrar:** Aplica filtros ao grid

### 3. **Grid de Cartões de Atividades**
- **Layout Responsivo:** 1-4 colunas conforme breakpoint
- **Componente:** `ExperienceCard`
- **Placeholder de Imagem:** 800×600px
- **Badge de Categoria:** Canto superior esquerdo

### 4. **Seção "Por que Escolher"**
- **Ícones:** Compass, Shield, Leaf, Users, Wrench
- **Grid 2 colunas:** Desktop / 1 coluna mobile
- **Disclaimer:** Protocolos de segurança

### 5. **Depoimentos**
- **Grid 3 colunas:** Desktop / responsivo
- **Avaliação:** 5 estrelas
- **Autores:** Ana C. (RJ), Carlos M. (SP), Maria L. (MG)

### 6. **CTA Final**
- **Background:** Verde pantanal
- **Urgência:** "Últimas vagas para a temporada de seca"
- **Botão:** "Garanta Minha Experiência"

### 7. **FAQ Section**
- **Componente:** `FAQSection` padronizado
- **Perguntas:** Reservas, cancelamentos, sazonalidade, experiência

## 🎯 Experiências Implementadas

### **1. Pesca Esportiva All-Inclusive**
- **Categoria:** Pesca
- **Duração:** 1 dia completo (6h–18h)
- **Grupo:** Até 3 pessoas
- **Preço:** R$ 2.000 / pessoa
- **Inclui:** Guia, barco, equipamentos, iscas, almoço, seguro

### **2. Safári Fotográfico & Birdwatching**
- **Categoria:** Ecoturismo
- **Duração:** 1 dia completo
- **Grupo:** Até 6 pessoas
- **Preço:** R$ 1.500 / pessoa
- **Inclui:** Guia biólogo, transporte, binóculos, lista de aves, lanches

### **3. Pôr do Sol Pantaneiro**
- **Categoria:** Contemplativo
- **Duração:** 3 horas (16h–19h)
- **Grupo:** Até 8 pessoas
- **Preço:** R$ 350 / pessoa
- **Inclui:** Barco, drinks, petiscos, guia, fotos

### **4. Safári Noturno em Barco**
- **Categoria:** Ecoturismo
- **Duração:** 3 horas (19h–22h)
- **Grupo:** Até 5 pessoas
- **Preço:** R$ 500 / pessoa
- **Inclui:** Barco com luz infravermelha, guia noturno, lanche, fotos

### **5. Nascer do Sol Pantaneiro**
- **Categoria:** Contemplativo
- **Duração:** 2 horas (5h–7h)
- **Grupo:** Até 6 pessoas
- **Preço:** R$ 300 / pessoa
- **Inclui:** Guia de aves, café pantaneiro, binóculos, transporte

### **6. Trilhas Ecológicas**
- **Categoria:** Aventura
- **Duração:** 4 horas (manhã)
- **Grupo:** Até 10 pessoas
- **Preço:** R$ 200 / pessoa
- **Inclui:** Guia, bastões, água, lanche, primeiros socorros

### **7. Trilha da Serra e Mirante**
- **Categoria:** Aventura
- **Duração:** 4 horas (manhã)
- **Grupo:** Até 10 pessoas
- **Preço:** R$ 200 / pessoa
- **Inclui:** Guia especializado, bastões, água, lanche, segurança

## 🔧 Componentes Técnicos

### **ExperienceCard Component**
```tsx
interface ExperienceProps {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  duration: string;
  groupSize: string;
  price: string;
  shortDescription: string;
  includes: string[];
  onClickCTA: () => void;
}
```

### **Funcionalidades**
- **Filtro por categoria:** Dinâmico
- **Placeholder de imagens:** 800×600px
- **Botões secundários:** Design system aplicado
- **FAQ integrado:** Componente padronizado
- **Responsividade:** Mobile-first

### **Estados de Interação**
- **Filtro vazio:** Mensagem "Nenhuma experiência disponível"
- **Hover nos cards:** Feedback visual
- **Scroll suave:** Hero CTA para grid
- **Loading states:** Preparado para implementação

## 📱 Responsividade

### **Breakpoints**
- **Mobile (sm):** 1 coluna
- **Tablet (md):** 2 colunas
- **Desktop (lg):** 3 colunas
- **Large (xl):** 4 colunas

### **Ajustes por Dispositivo**
- **Hero:** Altura e texto adaptáveis
- **Filtros:** Stack vertical em mobile
- **Cards:** Altura uniforme
- **Depoimentos:** Grid responsivo

## 🎨 Design System Aplicado

### **Tipografia**
- **Títulos:** Playfair Display
- **Corpo:** Lato
- **Hierarquia:** H1 > H2 > H3 > body

### **Cores**
- **Primary:** Pantanal Green 900
- **Secondary:** Sunset Amber 600
- **Background:** Cloud White 0, Sand Beige 100
- **Text:** River Slate 700/800

### **Componentes**
- **Botões:** Design system padronizado
- **Cards:** Shadow e border radius consistentes
- **Badges:** Categoria com cores temáticas
- **Icons:** Lucide React, 24×24px

## 🚀 Funcionalidades Futuras

### **Planejadas**
- [ ] **Integração com booking:** Modal de reserva
- [ ] **Filtro por data:** Disponibilidade real
- [ ] **Filtro por preço:** Range slider
- [ ] **Galeria de fotos:** Lightbox para cada experiência
- [ ] **Avaliações:** Sistema de reviews
- [ ] **Compartilhamento:** Social media
- [ ] **Favoritos:** Salvar experiências

### **CMS Integration**
- [ ] **Edição de experiências:** CRUD completo
- [ ] **Upload de imagens:** Substituir placeholders
- [ ] **Gestão de preços:** Sazonalidade
- [ ] **Disponibilidade:** Calendário
- [ ] **Depoimentos:** Moderação

## 📊 Métricas de Sucesso

### **UX Metrics**
- **Time on page:** Aumentar engajamento
- **Scroll depth:** Medir interesse
- **Click-through rate:** CTAs efetivos
- **Conversion rate:** Reservas realizadas

### **Performance**
- **Page load:** < 3 segundos
- **LCP:** < 2.5 segundos
- **CLS:** < 0.1
- **FID:** < 100ms

## 🔄 Manutenção

### **Atualizações Regulares**
- **Preços:** Revisão trimestral
- **Experiências:** Novas atividades sazonais
- **Depoimentos:** Rotação mensal
- **FAQ:** Baseado em dúvidas frequentes

### **Monitoramento**
- **Analytics:** Google Analytics 4
- **Heatmaps:** Hotjar ou similar
- **A/B Testing:** Otimização contínua
- **Feedback:** Formulários de satisfação

## ✅ Status de Implementação

### **Concluído**
- ✅ **Estrutura da página** completa
- ✅ **Componente ExperienceCard** funcional
- ✅ **Sistema de filtros** básico
- ✅ **Design system** aplicado
- ✅ **FAQ integrado** padronizado
- ✅ **Responsividade** implementada
- ✅ **Placeholders** de imagem
- ✅ **Depoimentos** estáticos

### **Próximos Passos**
1. **Integração com CMS** para edição de conteúdo
2. **Sistema de reservas** funcional
3. **Upload de imagens** reais
4. **Testes de usabilidade** com usuários
5. **Otimização de performance** final
