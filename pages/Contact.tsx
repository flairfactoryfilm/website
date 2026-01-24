import React, { useState, useEffect } from 'react';
import { submitContact } from '../services/dataService';
import { ContactForm } from '../types';
import { AlertCircle, ArrowRight, Copy, Check } from 'lucide-react';

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: 'Inquiry',
    budget: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setStatus('idle');
        setForm({ name: '', email: '', subject: 'Inquiry', budget: '', message: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const result = await submitContact(form);
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error.');
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const labelClass = "text-xs font-display font-bold uppercase tracking-widest text-primary/40 mb-2 block group-focus-within:text-primary transition-colors";

  return (
    // Layout의 pt-24(96px)를 고려하여 높이 계산. 모바일에서는 높이 제한 해제(min-h-fit)
    <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-8rem)] animate-fade-in">
      
      {/* Left Panel - Branding & Info */}
      <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-center border-r border-primary/5">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-none mb-6 text-primary">
            LET'S <br />
            <span className="text-secondary opacity-50">TALK.</span>
          </h1>
          <p className="text-lg md:text-xl text-primary/60 max-w-md font-light leading-relaxed break-keep">
            비전이 있으신가요? 저희가 구체화해 드립니다. 
            현재 2024년 4분기 프로젝트 접수 중입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-12 md:mt-16 relative z-10">
           <div>
             <h4 className="text-xs font-display font-bold uppercase tracking-widest text-primary/40 mb-4">Contact</h4>
             
             <div className="mb-2 group flex items-center gap-3 w-fit">
               <a href="mailto:hello@lumina.studio" className="block text-lg md:text-xl text-primary hover:text-secondary transition-colors font-medium">hello@lumina.studio</a>
               <button 
                 onClick={() => handleCopy('hello@lumina.studio', 'email')}
                 className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-secondary hover:text-primary"
                 aria-label="Copy Email"
               >
                 {copiedField === 'email' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
               </button>
             </div>

             <div className="group flex items-center gap-3 w-fit">
               <a href="tel:+15550000000" className="block text-lg md:text-xl text-primary hover:text-secondary transition-colors font-medium">+1 (555) 000-0000</a>
               <button 
                 onClick={() => handleCopy('+15550000000', 'phone')}
                 className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-secondary hover:text-primary"
                 aria-label="Copy Phone"
               >
                 {copiedField === 'phone' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
               </button>
             </div>
           </div>

           <div>
             <h4 className="text-xs font-display font-bold uppercase tracking-widest text-primary/40 mb-4">Studio</h4>
             <div className="group flex items-start gap-3 w-fit">
               <address className="text-lg md:text-xl text-primary not-italic font-medium">
                 123 Creative Ave<br />
                 New York, NY 10013
               </address>
               <button 
                 onClick={() => handleCopy('123 Creative Ave, New York, NY 10013', 'address')}
                 className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-secondary hover:text-primary mt-1"
                 aria-label="Copy Address"
               >
                 {copiedField === 'address' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
               </button>
             </div>
           </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      {/* absolute 제거하고 flex로 변경하여 겹침 방지 */}
      <div className={`w-full md:w-1/2 flex flex-col justify-center transition-colors duration-500 ease-in-out ${isButtonHovered ? 'bg-surface' : 'bg-surface/30'}`}>
        <div className="w-full h-full p-6 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          {/* Success Overlay */}
          <div 
            className={`absolute inset-0 flex items-center justify-center bg-surface/90 backdrop-blur-sm z-20 transition-all duration-500 ${status === 'success' ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
          >
            <div className="text-center">
              <h2 className={`text-4xl md:text-6xl font-display font-bold text-primary tracking-tighter mb-4 ${status === 'success' ? 'animate-slide-up' : 'opacity-0'}`}>
                INQUIRY SENT.
              </h2>
              <p 
                className={`text-lg font-light text-secondary tracking-widest uppercase ${status === 'success' ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: '0.2s' }}
              >
                24시간 내로 순차 회신 드리겠습니다.
              </p>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className={`space-y-8 max-w-xl mx-auto w-full transition-opacity duration-300 ${status === 'success' ? 'opacity-0' : 'opacity-100'}`}
          >
            <div className="space-y-6">
              <div className="group">
                <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-primary/20 py-3 text-lg focus:border-primary focus:outline-none transition-all placeholder:text-primary/10 text-primary"
                  placeholder="홍길동"
                />
              </div>
              <div className="group">
                <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-primary/20 py-3 text-lg focus:border-primary focus:outline-none transition-all placeholder:text-primary/10 text-primary"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="group">
                <label className={labelClass}>About Your Project <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-transparent border-b border-primary/20 py-3 text-lg focus:border-primary focus:outline-none transition-all placeholder:text-primary/10 resize-none text-primary"
                  placeholder="프로젝트에 대해 알려주세요..."
                />
              </div>

              <div className="group">
                <label className={labelClass}>Budget</label>
                <input
                  type="text"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-primary/20 py-3 text-lg focus:border-primary focus:outline-none transition-all placeholder:text-primary/10 text-primary"
                  placeholder="대략적인 예산을 기재해주세요."
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/5 p-4 rounded-lg">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={status === 'submitting'}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className="group w-full flex items-center justify-between text-2xl md:text-3xl font-display font-bold text-primary border-b border-primary/20 pb-4 hover:border-primary transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>{status === 'submitting' ? '처리 중...' : '문의하기'}</span>
                <span className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                   <ArrowRight className="w-5 h-5 transform group-hover:-rotate-45 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
