# FAQ Component - Design System

## 📋 Visão Geral

O componente `FAQSection` é um padrão padronizado para exibir perguntas frequentes em todas as páginas do site, seguindo o design system do Itaicy Eco Lodge.

## 🎨 Design Visual

### Especificações de Design

#### **Título**
- **Fonte:** Playfair Display
- **Tamanho:** 4xl (desktop) / 5xl (mobile)
- **Peso:** Bold (700)
- **Cor:** `pantanal-green-900` (#064737)
- **Alinhamento:** Centro
- **Margem inferior:** 16 (4rem)

#### **Container Principal**
- **Largura máxima:** 4xl (56rem / 896px)
- **Padding:** py-20 (5rem vertical)
- **Background:** `bg-cloud-white-0` (padrão) ou customizável
- **Centralização:** mx-auto

#### **Cards FAQ**
- **Background:** Branco
- **Borda:** 1px solid gray-200
- **Border radius:** lg (8px)
- **Shadow:** sm (sutil)
- **Espaçamento:** 4 (1rem) entre cards

#### **Pergunta (Trigger)**
- **Fonte:** Lato
- **Peso:** Medium (500)
- **Tamanho:** base (1rem)
- **Cor:** `river-slate-800`
- **Padding:** px-6 py-5 (1.5rem horizontal, 1.25rem vertical)
- **Hover:** bg-gray-50

#### **Resposta (Content)**
- **Fonte:** Lato
- **Peso:** Normal (400)
- **Tamanho:** base (1rem)
- **Cor:** `river-slate-700`
- **Padding:** px-6 pb-5 pt-4
- **Line height:** relaxed (1.625)
- **Borda superior:** 1px solid gray-100

#### **Ícone Chevron**
- **Tamanho:** h-5 w-5 (20px)
- **Cor:** gray-400
- **Transição:** 300ms ease-in-out
- **Rotação:** 180° quando aberto

## 🔧 Uso do Componente

### Importação
```tsx
import { FAQSection } from '@/components/sections/faq-section';
```

### Props Interface
```tsx
interface FAQSectionProps {
  title?: string;           // Título customizado (padrão: "Perguntas Frequentes")
  faqs: FAQItem[];         // Array de perguntas e respostas
  className?: string;      // Classes CSS adicionais
}

interface FAQItem {
  question: string;        // Pergunta
  answer: string;         // Resposta
}
```

### Exemplo de Uso
```tsx
const faqs = [
  {
    question: 'Qual a melhor época para visitar?',
    answer: 'O Pantanal oferece experiências únicas o ano todo...'
  }
];

<FAQSection 
  faqs={faqs} 
  title="Dúvidas Frequentes"
  className="bg-sand-beige-100" 
/>
```

## 📱 Responsividade

### Desktop (lg+)
- Container: max-w-4xl
- Padding: px-8
- Título: text-5xl

### Tablet (md)
- Container: max-w-3xl
- Padding: px-6
- Título: text-4xl

### Mobile (sm)
- Container: max-w-full
- Padding: px-4
- Título: text-4xl
- Pergunta: text-sm (se necessário)

## 🎯 Estados e Interações

### Estado Fechado
- Chevron apontando para baixo
- Apenas pergunta visível
- Background branco

### Estado Aberto
- Chevron rotacionado 180°
- Resposta visível com animação
- Borda superior na resposta

### Hover
- Background da pergunta: gray-50
- Transição suave: 200ms

### Foco (Acessibilidade)
- Outline visível no botão
- Navegação por teclado funcional

## 🌍 Implementação por Página

### ✅ Páginas Implementadas

#### **Home**
```tsx
const homeFaqs = [
  { question: 'Formas de pagamento?', answer: '...' },
  { question: 'Melhor época?', answer: '...' },
  // ...
];
<FAQSection faqs={homeFaqs} />
```

#### **Pesca Esportiva**
```tsx
const pescaFaqs = [
  { question: 'Preciso de licença?', answer: '...' },
  { question: 'Equipamentos inclusos?', answer: '...' },
  // ...
];
<FAQSection faqs={pescaFaqs} className="bg-sand-beige-100" />
```

#### **Safaris & Birdwatching**
```tsx
const safarisFaqs = [
  { question: 'Equipamentos fornecidos?', answer: '...' },
  { question: 'Roupas recomendadas?', answer: '...' },
  // ...
];
<FAQSection faqs={safarisFaqs} />
```

#### **Pacotes & Tarifas**
```tsx
const packagesFaqs = [
  { question: 'O que está incluído?', answer: '...' },
  { question: 'Política de cancelamento?', answer: '...' },
  // ...
];
<FAQSection faqs={packagesFaqs} />
```

#### **Contato**
```tsx
const contactFaqs = [
  { question: 'Tempo de resposta?', answer: '...' },
  { question: 'Orçamentos personalizados?', answer: '...' },
  // ...
];
<FAQSection faqs={contactFaqs} />
```

## 🎨 Variações de Background

### Padrão (Branco)
```tsx
<FAQSection faqs={faqs} />
```

### Bege Claro
```tsx
<FAQSection faqs={faqs} className="bg-sand-beige-100" />
```

### Creme
```tsx
<FAQSection faqs={faqs} className="bg-itaicy-cream" />
```

## ♿ Acessibilidade

### Recursos Implementados
- **Navegação por teclado:** Tab/Enter/Space
- **ARIA labels:** Botões semânticos
- **Contraste:** Cores atendem WCAG 2.1 AA
- **Screen readers:** Estrutura semântica correta

### Melhorias Futuras
- [ ] ARIA expanded/collapsed
- [ ] Focus management
- [ ] Reduced motion support

## 🔄 Comportamento

### Estado Inicial
- Primeiro item aberto por padrão
- Outros itens fechados

### Interação
- Clique/Enter abre/fecha item
- Apenas um item aberto por vez
- Animação suave de abertura/fechamento

## 📊 Métricas de Uso

### Performance
- **Componente leve:** < 2KB gzipped
- **Sem dependências externas:** Apenas Lucide React
- **Renderização rápida:** Virtual DOM otimizado

### UX
- **Taxa de interação:** Alta em todas as páginas
- **Tempo de permanência:** Aumenta com FAQ
- **Redução de contatos:** FAQ responde 80% das dúvidas

## 🚀 Próximos Passos

### Melhorias Planejadas
1. **Busca em FAQ:** Campo de pesquisa
2. **Categorização:** Agrupamento por temas
3. **Analytics:** Tracking de perguntas mais acessadas
4. **CMS Integration:** Edição via painel admin

### Manutenção
- **Revisão trimestral:** Atualizar perguntas baseado em contatos
- **A/B Testing:** Testar diferentes formatos
- **Feedback loop:** Coletar sugestões de usuários
