"use client";
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const Menu = ({ isOpen, onClose, mensagens, onFilterMessages, onSearchMessages, onDateFilter }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  
  const categorias = [
    { id: 'all', nome: 'Todas', icon: 'hugeicons:menu-square' },
    { id: 'motivacao', nome: 'Motivação', icon: 'hugeicons:star-01' },
    { id: 'saude', nome: 'Saúde', icon: 'hugeicons:health' },
    { id: 'dicas', nome: 'Dicas', icon: 'hugeicons:idea-01' },
    { id: 'exercicios', nome: 'Exercícios', icon: 'hugeicons:running-shoes-02' },
    { id: 'alimentacao', nome: 'Alimentação', icon: 'hugeicons:apple-01' }
  ];

  const dateFilters = [
    { id: 'all', nome: 'Todas as datas', icon: 'stash:calendar-light' },
    { id: 'today', nome: 'Hoje', icon: 'stash:calendar-day' },
    { id: 'yesterday', nome: 'Ontem', icon: 'stash:calendar-minus' },
    { id: 'week', nome: 'Últimos 7 dias', icon: 'stash:calendar-week' },
    { id: 'month', nome: 'Últimos 30 dias', icon: 'stash:calendar-month' },
    { id: 'custom', nome: 'Personalizado', icon: 'stash:calendar-settings' }
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sair',
      text: 'Tem certeza que deseja sair?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    });

    if (result.isConfirmed) {
      // Limpar todos os cookies e localStorage
      Cookies.remove('auth_token');
      localStorage.clear();
      sessionStorage.clear();
      
      Swal.fire({
        title: 'Saindo...',
        text: 'Você foi desconectado com sucesso',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearchMessages) {
      onSearchMessages(value);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onFilterMessages) {
      onFilterMessages(categoryId, searchTerm, selectedDate, customDateRange);
    }
  };

  const handleDateFilter = (dateId) => {
    setSelectedDate(dateId);
    if (dateId !== 'custom') {
      setCustomDateRange({ start: '', end: '' });
    }
    if (onDateFilter) {
      onDateFilter(dateId, customDateRange);
    }
    if (onFilterMessages) {
      onFilterMessages(selectedCategory, searchTerm, dateId, customDateRange);
    }
  };

  const handleCustomDateChange = (field, value) => {
    const newRange = { ...customDateRange, [field]: value };
    setCustomDateRange(newRange);
    if (selectedDate === 'custom' && onFilterMessages) {
      onFilterMessages(selectedCategory, searchTerm, 'custom', newRange);
    }
  };

  useEffect(() => {
    // Aplicar filtros quando termo de busca, categoria ou data mudar
    if (onFilterMessages) {
      onFilterMessages(selectedCategory, searchTerm, selectedDate, customDateRange);
    }
  }, [selectedCategory, searchTerm, selectedDate, customDateRange]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="menu-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {/* Menu Lateral */}
      <div 
        className={`menu-lateral ${isOpen ? 'menu-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? 0 : '-300px',
          width: '300px',
          height: '100dvh',
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
          transition: 'left 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header do Menu */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Menu</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            <Icon icon="hugeicons:cancel-01" width="24" style={{ color: '#86868B' }} />
          </button>
        </div>

        {/* Busca */}
        <div style={{ padding: '15px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '10px'
          }}>
            <Icon icon="hugeicons:search-01" width="20" style={{ color: '#86868B', marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Buscar mensagens..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                fontSize: '14px'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                <Icon icon="hugeicons:cancel-circle" width="20" style={{ color: '#86868B' }} />
              </button>
            )}
          </div>
        </div>

        {/* Área Scrollável */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Categorias */}
          <div style={{ padding: '15px' }}>
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#86868B',
            marginBottom: '15px',
            textTransform: 'uppercase'
          }}>
            Categorias
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {categorias.map(categoria => (
              <button
                key={categoria.id}
                onClick={() => handleCategoryFilter(categoria.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: selectedCategory === categoria.id ? '#e8f0fe' : 'transparent',
                  color: selectedCategory === categoria.id ? '#1c70f2' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: selectedCategory === categoria.id ? '600' : '400',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== categoria.id) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== categoria.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon 
                  icon={categoria.icon} 
                  width="20" 
                  style={{ 
                    color: selectedCategory === categoria.id ? '#1c70f2' : '#86868B',
                    marginRight: '12px'
                  }} 
                />
                {categoria.nome}
              </button>
            ))}
          </div>
          </div>

          {/* Filtro de Data */}
          <div style={{ padding: '15px' }}>
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#86868B',
            marginBottom: '15px',
            textTransform: 'uppercase'
          }}>
            Filtrar por Data
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {dateFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => handleDateFilter(filter.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: selectedDate === filter.id ? '#fff3e0' : 'transparent',
                  color: selectedDate === filter.id ? '#ff9800' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: selectedDate === filter.id ? '600' : '400',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (selectedDate !== filter.id) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDate !== filter.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon 
                  icon={filter.icon} 
                  width="20" 
                  style={{ 
                    color: selectedDate === filter.id ? '#ff9800' : '#86868B',
                    marginRight: '12px'
                  }} 
                />
                {filter.nome}
              </button>
            ))}
          </div>

          {/* Campos de data personalizada */}
          {selectedDate === 'custom' && (
            <div style={{ 
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  color: '#86868B',
                  marginBottom: '5px'
                }}>
                  Data inicial:
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '12px', 
                  color: '#86868B',
                  marginBottom: '5px'
                }}>
                  Data final:
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Botão Sair - Fixo no final */}
        <div style={{ 
          padding: '15px',
          borderTop: '1px solid #e0e0e0',
          flexShrink: 0
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#dc3545',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#c82333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc3545';
            }}
          >
            <Icon icon="hugeicons:logout-03" width="20" style={{ marginRight: '8px' }} />
            Sair
          </button>
        </div>
      </div>
    </>
  );
};

export default Menu;