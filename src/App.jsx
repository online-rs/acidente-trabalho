import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Brain, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Lock, 
  Plus, 
  Scale, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  MessageSquare, 
  Image as ImageIcon, 
  PlusCircle, 
  XCircle, 
  ShieldAlert, 
  Stethoscope, 
  Smile, 
  Clock, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';

export default function App() {
  // ==========================================
  // States
  // ==========================================
  const [headerShrunk, setHeaderShrunk] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [caso, setCaso] = useState('');
  const [provas, setProvas] = useState([]);
  const [afastamento, setAfastamento] = useState('');
  const [contrato, setContrato] = useState('');
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [provasWarning, setProvasWarning] = useState(false);

  // ==========================================
  // Effects & Observers
  // ==========================================
  useEffect(() => {
    // Header Shrink Scroll Listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderShrunk(true);
      } else {
        setHeaderShrunk(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
    };
  }, []);

  // ==========================================
  // Modal Logic
  // ==========================================
  const openModal = () => {
    setModalOpen(true);
    resetModal();
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const resetModal = () => {
    setCurrentStep(1);
    setCaso('');
    setProvas([]);
    setAfastamento('');
    setContrato('');
    setNome('');
    setCidade('');
    setProvasWarning(false);
  };

  // Checkbox Selection & Mutual Exclusion Logic
  const handleCheckboxChange = (value, isNoneOption) => {
    setProvasWarning(false);
    
    if (isNoneOption) {
      // If "Não tenho provas" is checked, clear everything else and keep only this
      setProvas([value]);
    } else {
      // If other proof is checked, remove "Não tenho provas"
      setProvas(prev => {
        const filtered = prev.filter(p => p !== 'Não tenho provas');
        if (filtered.includes(value)) {
          return filtered.filter(p => p !== value);
        } else {
          return [...filtered, value];
        }
      });
    }
  };

  // Step Navigation Logic
  const navigateNext = () => {
    if (currentStep === 1) {
      if (!caso) return;
      setCurrentStep(2);
    } 
    else if (currentStep === 2) {
      if (provas.length === 0) {
        setProvasWarning(true);
        return;
      }
      setCurrentStep(3);
    }
    else if (currentStep === 3) {
      if (!afastamento) return;
      setCurrentStep(4);
    } 
    else if (currentStep === 4) {
      if (!contrato) return;
      setCurrentStep(5);
    } 
    else if (currentStep === 5) {
      if (!nome.trim() || !cidade.trim()) {
        return;
      }
      
      const isPrescribed = contrato === 'Terminado há mais de 2 anos';
      if (isPrescribed) {
        setCurrentStep('warning');
      } else {
        setCurrentStep('success');
      }
    }
  };

  const navigateBack = () => {
    if (currentStep > 1 && typeof currentStep === 'number') {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Form Submission Message Formatting
  const getWhatsAppLink = (isPrescribed) => {
    const waBaseUrl = 'https://wa.me/5551993525391';
    let message = '';
    
    if (isPrescribed) {
      message = `Olá Dr. Bruno, fiz a triagem no site. Seguem meus dados:\n` +
                `- Nome: ${nome}\n` +
                `- Cidade: ${cidade}\n` +
                `- Caso: ${caso}\n` +
                `- Provas que possuo: ${provas.join(', ')}\n` +
                `- Afastamento/Médico: ${afastamento}\n` +
                `- ALERTA: Meu contrato de trabalho terminou há MAIS de 2 anos (alerta de prescrição).\n` +
                `Gostaria de consultar meu caso mesmo assim.`;
    } else {
      message = `Olá Dr. Bruno, fiz a triagem no site. Seguem meus dados:\n` +
                `- Nome: ${nome}\n` +
                `- Cidade: ${cidade}\n` +
                `- Caso: ${caso}\n` +
                `- Provas que possuo: ${provas.join(', ')}\n` +
                `- Afastamento/Médico: ${afastamento}\n` +
                `- Contrato: ${contrato}\n` +
                `Gostaria de falar com um especialista.`;
    }

    return `${waBaseUrl}?text=${encodeURIComponent(message)}`;
  };

  // Progress Bar Percentage calculation
  const getProgressPercentage = () => {
    if (typeof currentStep === 'number') {
      return currentStep * 20;
    }
    return 100;
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5551993525391?text=Olá,%20gostaria%20de%20falar%20com%20um%20especialista%20sobre%20meus%20direitos%20em%20relação%20a%20acidente%20de%20trabalho." 
        className="floating-whatsapp" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="Falar pelo WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>

      {/* Header Section */}
      <header className="site-header" style={{
        padding: headerShrunk ? '5px 0' : '0',
        backgroundColor: headerShrunk ? 'rgba(3, 7, 18, 0.92)' : 'rgba(3, 7, 18, 0.75)',
        boxShadow: headerShrunk ? '0 10px 30px rgba(0, 0, 0, 0.4)' : 'none'
      }}>
        <div className="container header-container">
          <div className="logo">
            <div className="logo-icon">
              <Scale size={28} />
            </div>
            <div className="logo-text">
              <span className="logo-main">Bruno de Oliveira</span>
              <span className="logo-sub">Advocacia Trabalhista</span>
            </div>
          </div>
          <div className="header-cta">
            <button onClick={openModal} className="btn-header">
              Falar com Advogado
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <ShieldCheck /> Atendimento Digital em todo o RS
          </div>
          <h1>Sofreu um <span>Acidente de Trabalho</span> ou tem uma <span>Doença Ocupacional</span>?</h1>
          <p>Entenda seus direitos de forma clara e saiba como agir para proteger sua saúde, seu emprego e garantir as indenizações previstas em lei.</p>
          
          <button onClick={openModal} className="btn-whatsapp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            Falar com Especialista no WhatsApp
          </button>
          
          <div className="hero-caption">
            <Lock style={{ width: '14px', height: '14px' }} /> Atendimento sigiloso e em conformidade com as regras da OAB
          </div>
        </div>
      </section>

      {/* Casos Mapeados Section */}
      <section className="section section-bg reveal" id="casos">
        <div className="container">
          <div className="section-header">
            <h2>Identifique seu Caso</h2>
            <p>A legislação protege o trabalhador em diversas situações de lesão ou adoecimento decorrente da atividade profissional. Veja onde seu caso se enquadra:</p>
          </div>
          
          <div className="grid-casos">
            <div className="card-caso">
              <div className="card-caso-bg"></div>
              <div className="card-icon">
                <Activity />
              </div>
              <h3>Acidentes Típicos</h3>
              <p>Ocorrências súbitas no local de trabalho que causam danos físicos, como quedas de altura, fraturas, queimaduras, cortes com ferramentas ou lesões por impacto de maquinário.</p>
            </div>
            <div className="card-caso">
              <div className="card-caso-bg"></div>
              <div className="card-icon">
                <Brain />
              </div>
              <h3>Doenças Ocupacionais</h3>
              <p>Problemas de saúde desencadeados ou agravados pelo ambiente laboral, como Síndrome de Burnout (esgotamento mental), depressão grave por assédio moral e crises de ansiedade.</p>
            </div>
            <div className="card-caso">
              <div className="card-caso-bg"></div>
              <div className="card-icon">
                <MapPin />
              </div>
              <h3>Acidente de Trajeto</h3>
              <p>Acidentes sofridos no percurso de ida ou volta do trabalho (seja de transporte público, veículo próprio ou a pé), que a lei equipara ao acidente de trabalho.</p>
            </div>
            <div className="card-caso">
              <div className="card-caso-bg"></div>
              <div className="card-icon">
                <AlertTriangle />
              </div>
              <h3>LER / DORT</h3>
              <p>Lesões por Esforços Repetitivos ou Distúrbios Osteomusculares Relacionados ao Trabalho, causados por movimentos repetitivos, postura inadequada ou esforço físico contínuo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rights Section */}
      <section className="section reveal" id="direitos">
        <div className="container">
          <div className="rights-block">
            <div className="rights-content">
              <h3>Seus 4 Direitos Fundamentais</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Muitos trabalhadores desconhecem as garantias legais asseguradas após sofrerem uma lesão ou adoecimento profissional. Estas são as principais defesas previstas por lei:</p>
              
              <ul className="rights-list">
                <li className="rights-item">
                  <div className="rights-item-icon"><CheckCircle2 /></div>
                  <div className="rights-item-text">
                    <h4>Estabilidade de 12 Meses</h4>
                    <p>Garantia de emprego por pelo menos um ano após o retorno do afastamento pelo INSS (tipo B91).</p>
                  </div>
                </li>
                <li className="rights-item">
                  <div className="rights-item-icon"><CheckCircle2 /></div>
                  <div className="rights-item-text">
                    <h4>Indenização por Danos Morais e Estéticos</h4>
                    <p>Compensação financeira pelo sofrimento, dor, perda de bem-estar ou por cicatrizes e marcas permanentes deixadas pelo acidente.</p>
                  </div>
                </li>
                <li className="rights-item">
                  <div className="rights-item-icon"><CheckCircle2 /></div>
                  <div className="rights-item-text">
                    <h4>Pensão Mensal por Perda de Capacidade</h4>
                    <p>Se o acidente resultou em limitação física permanente para a sua profissão, você pode ter direito a uma pensão paga pela empresa.</p>
                  </div>
                </li>
                <li className="rights-item">
                  <div className="rights-item-icon"><CheckCircle2 /></div>
                  <div className="rights-item-text">
                    <h4>Depósito Contínuo do FGTS</h4>
                    <p>A empresa é obrigada a continuar depositando seu FGTS mensalmente durante todo o período em que você estiver afastado pelo INSS por acidente.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="rights-action">
              <div className="callout-box">
                <h4>Ficou com alguma dúvida sobre o seu caso?</h4>
                <p>Faça uma consulta informativa inicial e entenda como a legislação se aplica à sua situação específica. Nosso atendimento é humanizado e 100% online.</p>
                <button onClick={openModal} className="btn-callout">
                  <HelpCircle style={{ marginRight: '8px', width: '18px', height: '18px' }} /> Analisar meus Direitos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps Section */}
      <section className="section section-bg reveal" id="funcionamento">
        <div className="container">
          <div className="section-header">
            <h2>Como Funciona o Atendimento?</h2>
            <p>Um processo ágil, simples e planejado para reduzir sua preocupação e focar no que mais importa: sua recuperação.</p>
          </div>
          
          <div className="steps-wrapper">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Contato pelo WhatsApp</h3>
              <p>Você inicia o contato clicando em um dos nossos botões e é atendido diretamente para relatar os fatos ocorridos.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Análise Documental</h3>
              <p>Analisamos a CAT (Comunicação de Acidente), laudos médicos, atestados e o histórico do contrato de trabalho.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Defesa dos Seus Direitos</h3>
              <p>Se constatados os danos e direitos violados, traçamos a melhor estratégia jurídica para buscar a devida reparação.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Authority Section */}
      <section className="section reveal" id="sobre">
        <div className="container">
          <div className="lawyer-profile">
            <div className="lawyer-img-wrapper">
              <div className="lawyer-avatar-placeholder">
                <Scale size={70} color="var(--accent)" style={{ strokeWidth: '1.5px' }} />
                <h4 style={{ color: 'white', fontSize: '22px', fontWeight: '700', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>Bruno de Oliveira</h4>
                <p style={{ color: 'var(--accent)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>OAB/RS 116.393</p>
              </div>
              <div className="lawyer-img-badge">
                <span>Registro Profissional</span>
                <strong>OAB/RS 116.393</strong>
              </div>
            </div>
            
            <div className="lawyer-bio">
              <span className="lawyer-title">Quem é seu Defensor</span>
              <h3>Bruno de Oliveira</h3>
              <p className="lawyer-text">Como advogado trabalhista, atuo com foco exclusivo na defesa e no resgate da dignidade de trabalhadores que sofreram acidentes ou contraíram doenças devido às suas atividades profissionais.</p>
              <p className="lawyer-text">Acredito em uma advocacia humanizada, ágil e focada em resultados práticos. Entendo que o trabalhador acidentado enfrenta um momento de extrema fragilidade física e financeira, por isso oferecemos um canal de atendimento direto, descomplicado e 100% digital, facilitando o acesso à justiça sem burocracias.</p>
              
              <div className="lawyer-quote">
                "A justiça no trabalho não é apenas sobre compensação financeira, mas sobre o respeito à saúde e à vida do trabalhador."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section-bg reveal" id="faq">
        <div className="container">
          <div className="section-header">
            <h2>Perguntas Frequentes</h2>
            <p>Confira as respostas para as principais dúvidas de trabalhadores que sofreram acidentes:</p>
          </div>
          
          <div className="faq-wrapper">
            {[
              {
                q: "Fui demitido logo após retornar do acidente. Isso é permitido?",
                a: "Se você ficou afastado pelo INSS recebendo o auxílio-doença acidentário (código B91), você tem direito a 12 meses de estabilidade após o retorno. A demissão sem justa causa nesse período é ilegal, cabendo pedido de reintegração ao emprego ou indenização substitutiva equivalente aos salários de todo o período de estabilidade."
              },
              {
                q: "Sofri um acidente na ida ou na volta do trabalho. É acidente de trabalho?",
                a: "Sim. O acidente de trajeto é equiparado por lei ao acidente de trabalho. Ele dá direito aos mesmos benefícios, incluindo a obrigatoriedade da emissão da CAT (Comunicação de Acidente de Trabalho) pela empresa, estabilidade no emprego e recolhimento do FGTS durante o período de afastamento pelo INSS."
              },
              {
                q: "A empresa não emitiu a CAT. O que eu devo fazer?",
                a: "Se a empresa se recusar a emitir a CAT, outros órgãos podem fazê-lo, como o próprio sindicato da categoria, o médico que o atendeu ou até mesmo o próprio trabalhador com o auxílio de um profissional. O mais importante é documentar o acidente formalmente para assegurar a natureza acidentária do afastamento no INSS."
              },
              {
                q: "Desenvolvi Burnout ou Depressão por cobrança excessiva. Tenho direitos?",
                a: "Sim. Doenças mentais como Síndrome de Burnout, depressão e transtornos de ansiedade gerados por assédio moral ou pressões extremas no trabalho são classificadas como Doenças Ocupacionais. Se comprovado o nexo causal com a atividade, o trabalhador tem exatamente os mesmos direitos de estabilidade e indenização de um acidente físico."
              }
            ].map((item, index) => (
              <div 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`} 
                key={index}
              >
                <button 
                  className="faq-trigger"
                  onClick={() => setActiveFaq(prev => prev === index ? null : index)}
                >
                  <h3>{item.q}</h3>
                  <Plus className="faq-icon" />
                </button>
                <div 
                  className="faq-content"
                  style={{
                    maxHeight: activeFaq === index ? '200px' : '0',
                    transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <div className="footer-logo">
                <span className="logo-main" style={{ fontSize: '22px', fontWeight: '800' }}>Bruno de Oliveira</span>
                <span className="logo-sub" style={{ display: 'block', color: 'var(--accent)', fontSize: '11px' }}>Advocacia Trabalhista</span>
              </div>
              <p className="footer-desc">Atuação jurídica dedicada à defesa dos direitos fundamentais do trabalhador gaúcho vítima de acidentes e doenças ocupacionais.</p>
            </div>
            
            <div>
              <h4>Navegação</h4>
              <ul className="footer-links">
                <li><a href="#casos">Casos Comuns</a></li>
                <li><a href="#direitos">Seus Direitos</a></li>
                <li><a href="#funcionamento">Como Funciona</a></li>
                <li><a href="#sobre">Sobre o Advogado</a></li>
                <li><a href="#faq">Perguntas Frequentes</a></li>
              </ul>
            </div>
            
            <div>
              <h4>Contato</h4>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" size={18} />
                <span>(51) 99352-5391</span>
              </div>
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" size={18} />
                <span>contato@brunooliveira.adv.br</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" size={18} />
                <span>Porto Alegre - RS | Atendimento Online</span>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-legal">
              <p><strong>Bruno de Oliveira Advocacia - OAB/RS 116.393.</strong></p>
              <p style={{ fontSize: '11px', marginTop: '5px', opacity: '0.7' }}>Nota Ética: Este site possui caráter meramente informativo e educacional sobre direitos trabalhistas e previdenciários, conforme o Provimento nº 205/2021 da Ordem dos Advogados do Brasil (OAB). Nenhuma informação aqui constitui consulta jurídica formal.</p>
            </div>
            <div className="footer-copy">
              <p>&copy; 2026 Bruno de Oliveira. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Triagem Modal Overlay */}
      <div className={`modal-overlay ${modalOpen ? 'active' : ''}`}>
        <div className="modal-card">
          <button className="modal-close" onClick={closeModal}>&times;</button>
          
          {/* Progress Bar */}
          {typeof currentStep === 'number' && (
            <div className="modal-progress-container">
              <div 
                className="modal-progress-bar" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          )}
          
          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* Step 1: Tipo de Ocorrência */}
            {currentStep === 1 && (
              <div className="modal-step active">
                <h3>Qual o tipo da ocorrência?</h3>
                <p className="modal-step-desc">Selecione a opção que melhor descreve o seu caso:</p>
                <div className="options-grid">
                  {[
                    { val: 'Acidente de Trabalho', label: 'Acidente de Trabalho (Físico / Trajeto)', icon: <Activity /> },
                    { val: 'Doença do Trabalho', label: 'Doença do Trabalho (LER/DORT, Burnout, etc.)', icon: <Brain /> },
                    { val: 'Não sabe dizer', label: 'Não sei dizer se é acidente ou doença', icon: <HelpCircle /> },
                    { val: 'Outro Assunto', label: 'Dúvida geral / Outra área trabalhista', icon: <FileText /> }
                  ].map(opt => (
                    <div 
                      className={`option-card ${caso === opt.val ? 'selected' : ''}`}
                      key={opt.val}
                      onClick={() => {
                        setCaso(opt.val);
                        setTimeout(() => setCurrentStep(2), 300); // Auto advance
                      }}
                    >
                      <input 
                        type="radio" 
                        name="triagem-caso" 
                        value={opt.val} 
                        checked={caso === opt.val} 
                        onChange={() => {}} 
                      />
                      <div className="option-content">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Provas Disponíveis */}
            {currentStep === 2 && (
              <div className="modal-step active">
                <h3>Quais provas ou documentos você possui?</h3>
                <p className="modal-step-desc">Selecione todas as opções de provas que você tem acesso (pode marcar várias):</p>
                <div className="options-grid" style={{ marginBottom: '20px' }}>
                  {[
                    { val: 'Laudo Médico / Atestados', label: 'Laudo Médico, Receitas ou Atestados', icon: <FileText />, none: false },
                    { val: 'Testemunhas', label: 'Testemunhas que presenciaram o ocorrido', icon: <Users />, none: false },
                    { val: 'Mensagens (WhatsApp/E-mails)', label: 'Conversas por WhatsApp, SMS ou E-mails', icon: <MessageSquare />, none: false },
                    { val: 'Vídeos ou Fotos', label: 'Vídeos ou fotos do local ou da lesão', icon: <ImageIcon />, none: false },
                    { val: 'Outras provas documentais', label: 'Outros documentos e comprovantes', icon: <PlusCircle />, none: false },
                    { val: 'Não tenho provas', label: 'Não possuo nenhuma prova no momento', icon: <XCircle />, none: true }
                  ].map(opt => {
                    const isSelected = provas.includes(opt.val);
                    return (
                      <div 
                        className={`option-card ${isSelected ? 'selected' : ''}`}
                        key={opt.val}
                        onClick={() => handleCheckboxChange(opt.val, opt.none)}
                      >
                        <input 
                          type="checkbox" 
                          name="triagem-provas" 
                          value={opt.val} 
                          checked={isSelected}
                          onChange={() => {}} 
                        />
                        <div className="option-content">
                          {opt.icon}
                          <span>{opt.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {provasWarning && (
                  <p id="provas-warning" style={{ color: '#ff6b6b', fontSize: '13px', display: 'block', marginBottom: '24px', textAlign: 'left', fontWeight: 500 }}>
                    <AlertCircle style={{ width: '14px', height: '14px', display: 'inline-block', transform: 'translateY(2px)', marginRight: '4px', color: '#ff6b6b' }} /> 
                    Por favor, selecione pelo menos uma opção para avançar.
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Afastamento / Médico */}
            {currentStep === 3 && (
              <div className="modal-step active">
                <h3>Houve atendimento médico ou afastamento pelo INSS?</h3>
                <p className="modal-step-desc">Isso ajuda a dimensionar a gravidade do caso:</p>
                <div className="options-grid">
                  {[
                    { val: 'Sim, com afastamento pelo INSS', label: 'Sim, fiquei afastado pelo INSS (Auxílio B91)', icon: <ShieldAlert /> },
                    { val: 'Apenas atendimento médico (sem INSS)', label: 'Apenas atendimento médico / Pronto Socorro', icon: <Stethoscope /> },
                    { val: 'Não precisei de atendimento médico', label: 'Não precisei de atendimento ou exames', icon: <Smile /> }
                  ].map(opt => (
                    <div 
                      className={`option-card ${afastamento === opt.val ? 'selected' : ''}`}
                      key={opt.val}
                      onClick={() => {
                        setAfastamento(opt.val);
                        setTimeout(() => setCurrentStep(4), 300); // Auto advance
                      }}
                    >
                      <input 
                        type="radio" 
                        name="triagem-afastamento" 
                        value={opt.val} 
                        checked={afastamento === opt.val}
                        onChange={() => {}} 
                      />
                      <div className="option-content">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Status do Contrato */}
            {currentStep === 4 && (
              <div className="modal-step active">
                <h3>Como está o seu contrato de trabalho com a empresa?</h3>
                <p className="modal-step-desc">Precisamos analisar o prazo legal de prescrição trabalhista:</p>
                <div className="options-grid">
                  {[
                    { val: 'Ativo (Continuo trabalhando lá)', label: 'Ainda continuo trabalhando na empresa', icon: <CheckCircle2 /> },
                    { val: 'Terminado há menos de 2 anos', label: 'Terminou há MENOS de 2 anos', icon: <Clock /> },
                    { val: 'Terminado há mais de 2 anos', label: 'Terminou há MAIS de 2 anos (Alerta de Prescrição)', icon: <AlertCircle /> }
                  ].map(opt => (
                    <div 
                      className={`option-card ${contrato === opt.val ? 'selected' : ''}`}
                      key={opt.val}
                      onClick={() => {
                        setContrato(opt.val);
                        setTimeout(() => setCurrentStep(5), 300); // Auto advance
                      }}
                    >
                      <input 
                        type="radio" 
                        name="triagem-contrato" 
                        value={opt.val} 
                        checked={contrato === opt.val}
                        onChange={() => {}} 
                      />
                      <div className="option-content">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Nome e Cidade */}
            {currentStep === 5 && (
              <div className="modal-step active">
                <h3>Qual o seu nome e cidade de onde está falando?</h3>
                <p className="modal-step-desc">Seus dados serão enviados de forma privada e segura para o Dr. Bruno:</p>
                <div className="input-group">
                  <label htmlFor="lead-nome">Seu Nome Completo:</label>
                  <input 
                    type="text" 
                    id="lead-nome" 
                    placeholder="Digite seu nome" 
                    required 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="lead-cidade">Sua Cidade e Estado:</label>
                  <input 
                    type="text" 
                    id="lead-cidade" 
                    placeholder="Ex: Porto Alegre - RS" 
                    required 
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step Success (Qualificado) */}
            {currentStep === 'success' && (
              <div className="modal-step active">
                <div className="result-message success">
                  <div className="result-icon success">
                    <CheckCircle />
                  </div>
                  <h3>Triagem Concluída!</h3>
                  <p>Seus dados indicam viabilidade para análise. Clique abaixo para enviar seu resumo e falar diretamente com o Dr. Bruno no WhatsApp.</p>
                  
                  <a 
                    href={getWhatsAppLink(false)} 
                    className="btn-whatsapp" 
                    id="btn-submit-qualificado" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ width: '100%', marginTop: '15px' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '22px', height: '22px', marginRight: '10px' }}>
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Iniciar Conversa Segura
                  </a>
                </div>
              </div>
            )}

            {/* Step Warning (Prescrição / Terminou há mais de 2 anos) */}
            {currentStep === 'warning' && (
              <div className="modal-step active">
                <div className="result-message warning">
                  <div className="result-icon warning">
                    <AlertTriangle />
                  </div>
                  <h3>Aviso de Prazo Excedido</h3>
                  <p id="warning-text">A legislação estabelece um limite de 2 anos após o término do contrato para reivindicar direitos na Justiça do Trabalho. Como seu contrato terminou há mais de 2 anos, a ação judicial pode estar prescrita.</p>
                  <p className="warning-sub">Existem raras exceções na lei (como incapacidade absoluta ou menoridade na época). Se mesmo sabendo do prazo você queira relatar sua situação, clique abaixo para falar com o Dr. Bruno.</p>
                  
                  <a 
                    href={getWhatsAppLink(true)} 
                    className="btn-whatsapp" 
                    id="btn-submit-warning" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ width: '100%', marginTop: '15px', backgroundColor: 'var(--accent)', color: 'var(--bg-deep)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" style={{ width: '22px', height: '22px', marginRight: '10px' }}>
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Prosseguir mesmo assim
                  </a>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {typeof currentStep === 'number' && (
              <div className="modal-nav-buttons" id="modal-nav">
                <button 
                  type="button" 
                  className="btn-nav back" 
                  onClick={navigateBack} 
                  disabled={currentStep === 1}
                >
                  Voltar
                </button>
                <button 
                  type="button" 
                  className="btn-nav next" 
                  onClick={navigateNext}
                  disabled={
                    (currentStep === 1 && !caso) ||
                    (currentStep === 2 && provas.length === 0) ||
                    (currentStep === 3 && !afastamento) ||
                    (currentStep === 4 && !contrato)
                  }
                >
                  {currentStep === 5 ? 'Finalizar Triagem' : 'Avançar'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
