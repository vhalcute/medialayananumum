import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { RoomBookingView } from './components/views/RoomBookingView';
import { VehicleBookingView } from './components/views/VehicleBookingView';
import { BmnBookingView } from './components/views/BmnBookingView';
import { MaintenanceTicketView } from './components/views/MaintenanceTicketView';
import { AtkRequestView } from './components/views/AtkRequestView';
import { KepegawaianView } from './components/views/KepegawaianView';
import { PenilaianKinerjaView } from './components/views/PenilaianKinerjaView';
import { KeuanganView } from './components/views/KeuanganView';
import { InformasiView } from './components/views/InformasiView';
import { EmployeeAdvocacyMonitoringView } from './components/views/EmployeeAdvocacyMonitoringView';
import { PengelolaanAksesAdminView } from './components/views/PengelolaanAksesAdminView';
import { PrintDocumentModal } from './components/modals/PrintDocumentModal';
import { UniversalBookingModal } from './components/modals/UniversalBookingModal';
import { LogoutModal } from './components/modals/LogoutModal';
import { LoginPortalModal } from './components/modals/LoginPortalModal';
import { LoginView } from './components/auth/LoginView';

import {
  ActiveTab,
  PerformanceScheduleItem,
  RoomItem,
  RoomBooking,
  VehicleItem,
  VehicleBooking,
  BmnItem,
  BmnBorrowing,
  MaintenanceTicket,
  AtkItem,
  AtkRequest,
  TodayAgenda
} from './types';

import {
  INITIAL_PERFORMANCE_SCHEDULE,
  INITIAL_ROOMS,
  INITIAL_ROOM_BOOKINGS,
  INITIAL_VEHICLES,
  INITIAL_VEHICLE_BOOKINGS,
  INITIAL_BMN_ITEMS,
  INITIAL_BMN_BORROWINGS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_ATK_CATALOG,
  INITIAL_ATK_REQUESTS,
  INITIAL_TODAY_AGENDAS
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard');
  
  // Authentication & session state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('mlu_jambi_logged_in');
    return saved !== null ? saved === 'true' : true;
  });
  const [activeRole, setActiveRole] = useState<'pegawai' | 'kasubbag' | 'admin'>(() => {
    const savedRole = localStorage.getItem('mlu_jambi_active_role');
    return (savedRole as 'pegawai' | 'kasubbag' | 'admin') || 'pegawai';
  });
  const [loggedInUser, setLoggedInUser] = useState<string>(() => {
    return localStorage.getItem('mlu_jambi_username') || 'Pegawai Kanwil';
  });

  // Stored state with local storage fallback
  const [scheduleItems, setScheduleItems] = useState<PerformanceScheduleItem[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_schedule_tw3');
    return saved ? JSON.parse(saved) : INITIAL_PERFORMANCE_SCHEDULE;
  });

  const [rooms] = useState<RoomItem[]>(INITIAL_ROOMS);
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_room_bookings');
    return saved ? JSON.parse(saved) : INITIAL_ROOM_BOOKINGS;
  });

  const [vehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
  const [vehicleBookings, setVehicleBookings] = useState<VehicleBooking[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_vehicle_bookings');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLE_BOOKINGS;
  });

  const [bmnItems] = useState<BmnItem[]>(INITIAL_BMN_ITEMS);
  const [bmnBorrowings, setBmnBorrowings] = useState<BmnBorrowing[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_bmn_borrowings');
    return saved ? JSON.parse(saved) : INITIAL_BMN_BORROWINGS;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_tickets');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS;
  });

  const [atkCatalog] = useState<AtkItem[]>(INITIAL_ATK_CATALOG);
  const [atkRequests, setAtkRequests] = useState<AtkRequest[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_atk_requests');
    return saved ? JSON.parse(saved) : INITIAL_ATK_REQUESTS;
  });

  const [todayAgendas, setTodayAgendas] = useState<TodayAgenda[]>(() => {
    const saved = localStorage.getItem('mlu_jambi_agendas');
    return saved ? JSON.parse(saved) : INITIAL_TODAY_AGENDAS;
  });

  // Modal states
  const [printModal, setPrintModal] = useState<{
    isOpen: boolean;
    type: 'room' | 'vehicle' | 'bmn' | 'atk';
    data: any;
  }>({
    isOpen: false,
    type: 'room',
    data: null,
  });

  const [universalModal, setUniversalModal] = useState<{
    isOpen: boolean;
    defaultCategory?: 'room' | 'vehicle' | 'bmn' | 'ticket' | 'atk';
  }>({
    isOpen: false,
    defaultCategory: 'room',
  });

  const [logoutModal, setLogoutModal] = useState<{
    isOpen: boolean;
    type: 'admin' | 'pegawai';
  }>({
    isOpen: false,
    type: 'admin',
  });

  const [loginPortalModal, setLoginPortalModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleLogoutConfirm = (type: 'admin' | 'pegawai') => {
    setLogoutModal({ isOpen: false, type });
    setIsLoggedIn(false);
    localStorage.setItem('mlu_jambi_logged_in', 'false');
    localStorage.removeItem('mlu_jambi_username');
    setActiveRole('pegawai');
    setCurrentTab('dashboard');
    if (type === 'admin') {
      showToast('Sesi Administrator berhasil keluar. Silakan masukkan kredensial pada menu login.', 'warning');
    } else {
      showToast('Sesi Pegawai berhasil keluar. Silakan masukkan kredensial pada menu login.', 'info');
    }
  };

  const handleLoginSuccess = (role: 'admin' | 'pegawai', username?: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('mlu_jambi_logged_in', 'true');
    localStorage.setItem('mlu_jambi_active_role', role);
    if (username) {
      localStorage.setItem('mlu_jambi_username', username);
      setLoggedInUser(username);
    }
    setActiveRole(role);
    setLoginPortalModal(false);
    setCurrentTab(role === 'admin' ? 'admin-akses' : 'dashboard');
    showToast(
      `Selamat datang! Berhasil masuk sebagai ${role === 'admin' ? 'Administrator' : 'Pegawai Kanwil'}${username ? ` (${username})` : ''}.`,
      'success'
    );
  };

  const handleLoginAs = handleLoginSuccess;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('mlu_jambi_schedule_tw3', JSON.stringify(scheduleItems));
  }, [scheduleItems]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_room_bookings', JSON.stringify(roomBookings));
  }, [roomBookings]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_vehicle_bookings', JSON.stringify(vehicleBookings));
  }, [vehicleBookings]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_bmn_borrowings', JSON.stringify(bmnBorrowings));
  }, [bmnBorrowings]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_atk_requests', JSON.stringify(atkRequests));
  }, [atkRequests]);

  useEffect(() => {
    localStorage.setItem('mlu_jambi_agendas', JSON.stringify(todayAgendas));
  }, [todayAgendas]);

  // Handlers for room bookings
  const handleAddRoomBooking = (booking: Omit<RoomBooking, 'id' | 'submittedAt'>) => {
    const id = `RB-2026-${String(roomBookings.length + 1).padStart(3, '0')}`;
    const newBooking: RoomBooking = {
      ...booking,
      id,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setRoomBookings([newBooking, ...roomBookings]);

    // Add to today agendas if for today/soon
    const newAgenda: TodayAgenda = {
      id: `ag-rb-${id}`,
      category: 'rapat',
      title: newBooking.activityName,
      time: `${newBooking.startTime} - ${newBooking.endTime} WIB`,
      location: newBooking.roomName,
      pic: newBooking.picName,
      division: newBooking.division,
      status: 'Dijadwalkan',
    };
    setTodayAgendas([newAgenda, ...todayAgendas]);
  };

  const handleUpdateRoomStatus = (id: string, status: RoomBooking['status']) => {
    setRoomBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const handleUpdateRoomBooking = (updated: RoomBooking) => {
    setRoomBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    setTodayAgendas(prev => prev.map(a => {
      if (a.id === `ag-rb-${updated.id}`) {
        return {
          ...a,
          title: updated.activityName,
          time: `${updated.startTime} - ${updated.endTime} WIB`,
          location: updated.roomName,
          pic: updated.picName,
          division: updated.division,
        };
      }
      return a;
    }));
  };

  const handleDeleteRoomBooking = (id: string) => {
    setRoomBookings(prev => prev.filter(b => b.id !== id));
    setTodayAgendas(prev => prev.filter(a => a.id !== `ag-rb-${id}`));
  };

  // Handlers for vehicles
  const handleAddVehicleBooking = (booking: Omit<VehicleBooking, 'id' | 'submittedAt'>) => {
    const id = `KB-2026-${String(vehicleBookings.length + 1).padStart(3, '0')}`;
    const newBooking: VehicleBooking = {
      ...booking,
      id,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setVehicleBookings([newBooking, ...vehicleBookings]);

    const newAgenda: TodayAgenda = {
      id: `ag-kb-${id}`,
      category: 'kendaraan',
      title: `${newBooking.purpose} ke ${newBooking.destination}`,
      time: `${newBooking.departureTime} - ${newBooking.returnTime} WIB`,
      location: `${newBooking.vehicleName} (${newBooking.plateNumber}) - Driver: ${newBooking.driverName}`,
      pic: newBooking.requesterName,
      division: newBooking.division,
      status: 'Dijadwalkan',
    };
    setTodayAgendas([newAgenda, ...todayAgendas]);
  };

  const handleUpdateVehicleStatus = (id: string, status: VehicleBooking['status']) => {
    setVehicleBookings(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const handleUpdateVehicleBooking = (updated: VehicleBooking) => {
    setVehicleBookings(prev => prev.map(v => v.id === updated.id ? updated : v));
    setTodayAgendas(prev => prev.map(a => {
      if (a.id === `ag-kb-${updated.id}`) {
        return {
          ...a,
          title: `${updated.purpose || 'Perjalanan Dinas'} ke ${updated.destination}`,
          time: `${updated.departureTime} - ${updated.returnTime} WIB`,
          location: `${updated.vehicleName} (${updated.plateNumber}) - Layanan: ${updated.serviceType || 'Dengan Supir'} (${updated.driverName})`,
          pic: updated.requesterName,
          division: updated.division,
        };
      }
      return a;
    }));
  };

  const handleDeleteVehicleBooking = (id: string) => {
    setVehicleBookings(prev => prev.filter(v => v.id !== id));
    setTodayAgendas(prev => prev.filter(a => a.id !== `ag-kb-${id}`));
  };

  // Handlers for BMN (Peminjaman Barang)
  const handleAddBmnBorrowing = (borrowing: Omit<BmnBorrowing, 'id'>) => {
    const id = `PINJAM-2026-${String(bmnBorrowings.length + 1).padStart(3, '0')}`;
    const newBorrowing: BmnBorrowing = {
      ...borrowing,
      id,
    };
    setBmnBorrowings([newBorrowing, ...bmnBorrowings]);
  };

  const handleUpdateBmnBorrowing = (updated: BmnBorrowing) => {
    setBmnBorrowings(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleDeleteBmnBorrowing = (id: string) => {
    setBmnBorrowings(prev => prev.filter(b => b.id !== id));
  };

  const handleUpdateBmnStatus = (id: string, status: BmnBorrowing['status']) => {
    setBmnBorrowings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  // Handlers for Maintenance Tickets
  const handleAddTicket = (ticket: Omit<MaintenanceTicket, 'id' | 'submittedAt'>) => {
    const id = `TIK-TURT-${100 + tickets.length + 1}`;
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setTickets([newTicket, ...tickets]);
  };

  const handleUpdateTicketStatus = (id: string, status: MaintenanceTicket['status'], note?: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, technicianNotes: note || t.technicianNotes } : t));
  };

  // Handlers for ATK
  const handleAddAtkRequest = (req: Omit<AtkRequest, 'id' | 'requestDate'>) => {
    const id = `ATK-REQ-2026-${String(atkRequests.length + 42).padStart(3, '0')}`;
    const newReq: AtkRequest = {
      ...req,
      id,
      requestDate: new Date().toISOString().slice(0, 10),
    };
    setAtkRequests([newReq, ...atkRequests]);
  };

  const handleUpdateAtkStatus = (id: string, status: AtkRequest['status']) => {
    setAtkRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  // Toggle Schedule item completion
  const handleToggleScheduleItem = (id: number) => {
    setScheduleItems(prev => prev.map(item => item.id === id ? { ...item, isCompleted: !item.isCompleted } : item));
  };

  // Counts of pending requests for Kasubbag
  const pendingCounts = {
    rooms: roomBookings.filter(b => b.status === 'Menunggu').length,
    vehicles: vehicleBookings.filter(b => b.status === 'Menunggu').length,
    tickets: tickets.filter(t => t.status === 'Menunggu').length,
    atk: atkRequests.filter(r => r.status === 'Menunggu Kasubbag').length,
  };
  const totalPending = pendingCounts.rooms + pendingCounts.vehicles + pendingCounts.tickets + pendingCounts.atk;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#eef3f8] flex flex-col justify-center">
        <LoginView
          isModal={false}
          onLoginSuccess={handleLoginSuccess}
        />
        {/* Session Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                toastMessage.type === 'warning'
                  ? 'bg-amber-400'
                  : toastMessage.type === 'info'
                  ? 'bg-blue-400'
                  : 'bg-emerald-400'
              }`}
            />
            <p className="text-xs font-medium text-slate-200">{toastMessage.text}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-auto text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar with Ticker, Clock & Search */}
      <TopBar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onNavigate={setCurrentTab}
        pendingCount={totalPending}
        onOpenUniversalModal={() => setUniversalModal({ isOpen: true, defaultCategory: 'room' })}
        onLogout={(type) => setLogoutModal({ isOpen: true, type })}
      />

      {/* Main Container: Sidebar + Content Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          pendingRequestsCount={pendingCounts}
          activeRole={activeRole}
          onLogout={(type) => setLogoutModal({ isOpen: true, type })}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              scheduleItems={scheduleItems}
              onToggleScheduleItem={handleToggleScheduleItem}
              todayAgendas={todayAgendas}
              onNavigate={setCurrentTab}
              onOpenUniversalModal={(category) => setUniversalModal({ isOpen: true, defaultCategory: category })}
              rooms={rooms}
              vehicles={vehicles}
            />
          )}

          {currentTab === 'turt-ruangan' && (
            <RoomBookingView
              rooms={rooms}
              bookings={roomBookings}
              onAddBooking={handleAddRoomBooking}
              onUpdateBooking={handleUpdateRoomBooking}
              onDeleteBooking={handleDeleteRoomBooking}
              onUpdateStatus={handleUpdateRoomStatus}
              onPrintBooking={(booking) => setPrintModal({ isOpen: true, type: 'room', data: booking })}
              activeRole={activeRole}
            />
          )}

          {currentTab === 'turt-kendaraan' && (
            <VehicleBookingView
              vehicles={vehicles}
              bookings={vehicleBookings}
              onAddBooking={handleAddVehicleBooking}
              onUpdateBooking={handleUpdateVehicleBooking}
              onDeleteBooking={handleDeleteVehicleBooking}
              onUpdateStatus={handleUpdateVehicleStatus}
              onPrintBooking={(booking) => setPrintModal({ isOpen: true, type: 'vehicle', data: booking })}
              activeRole={activeRole}
            />
          )}

          {currentTab === 'turt-bmn' && (
            <BmnBookingView
              items={bmnItems}
              borrowings={bmnBorrowings}
              onAddBorrowing={handleAddBmnBorrowing}
              onUpdateBorrowing={handleUpdateBmnBorrowing}
              onDeleteBorrowing={handleDeleteBmnBorrowing}
              onUpdateStatus={handleUpdateBmnStatus}
              onPrintBorrowing={(b) => setPrintModal({ isOpen: true, type: 'bmn', data: b })}
              activeRole={activeRole}
            />
          )}

          {currentTab === 'turt-perbaikan' && (
            <MaintenanceTicketView
              tickets={tickets}
              onAddTicket={handleAddTicket}
              onUpdateStatus={handleUpdateTicketStatus}
              activeRole={activeRole}
            />
          )}

          {currentTab === 'turt-atk' && (
            <AtkRequestView
              catalog={atkCatalog}
              requests={atkRequests}
              onAddRequest={handleAddAtkRequest}
              onUpdateStatus={handleUpdateAtkStatus}
              onPrintRequest={(req) => setPrintModal({ isOpen: true, type: 'atk', data: req })}
              activeRole={activeRole}
            />
          )}

          {(currentTab === 'kepeg-gkm' || currentTab === 'kepeg-seribu' || currentTab === 'kepeg-beasiswa' || currentTab === 'kepeg-tlego' || currentTab === 'kepeg-dkm' || currentTab === 'kepeg-berkas' || currentTab === 'kepeg-cuti') && (
            <KepegawaianView currentTab={currentTab} />
          )}

          {(currentTab === 'pk-monitoring' || currentTab === 'pk-abk' || currentTab === 'pk-dams' || currentTab === 'pk-katalog' || currentTab === 'pk-feedback' || currentTab === 'pk-jadwal' || currentTab === 'pk-rbk' || currentTab === 'pk-dsku') && (
            <PenilaianKinerjaView currentTab={currentTab} />
          )}

          {(currentTab === 'keu-rencana' || currentTab === 'keu-realisasi' || currentTab === 'keu-alokasi' || currentTab === 'keu-realisasi-bidang') && (
            <KeuanganView />
          )}

          {currentTab === 'info-advocacy' && (
            <EmployeeAdvocacyMonitoringView />
          )}

          {(currentTab === 'info-security' || currentTab === 'info-evaluasi' || currentTab === 'info-kegiatan' || currentTab === 'info-agenda') && (
            <InformasiView currentTab={currentTab} />
          )}

          {currentTab === 'admin-akses' && (
            <PengelolaanAksesAdminView />
          )}
        </main>
      </div>

      {/* Official Print Letter / Receipt Modal */}
      <PrintDocumentModal
        isOpen={printModal.isOpen}
        onClose={() => setPrintModal({ ...printModal, isOpen: false })}
        documentType={printModal.type}
        data={printModal.data}
      />

      {/* Universal Quick Submission Modal */}
      <UniversalBookingModal
        isOpen={universalModal.isOpen}
        onClose={() => setUniversalModal({ ...universalModal, isOpen: false })}
        defaultCategory={universalModal.defaultCategory}
        rooms={rooms}
        vehicles={vehicles}
        bmnItems={bmnItems}
        atkCatalog={atkCatalog}
        onSubmitRoom={handleAddRoomBooking}
        onSubmitVehicle={handleAddVehicleBooking}
        onSubmitBmn={handleAddBmnBorrowing}
        onSubmitTicket={handleAddTicket}
        onSubmitAtk={handleAddAtkRequest}
      />

      {/* Logout Confirmation Modal (Distinct for Admin and Pegawai) */}
      <LogoutModal
        isOpen={logoutModal.isOpen}
        type={logoutModal.type}
        onClose={() => setLogoutModal({ ...logoutModal, isOpen: false })}
        onConfirm={handleLogoutConfirm}
      />

      {/* Login Portal Modal (Re-entry Gateway) */}
      <LoginPortalModal
        isOpen={loginPortalModal}
        onClose={() => setLoginPortalModal(false)}
        onLoginAs={handleLoginAs}
      />

      {/* Session Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              toastMessage.type === 'warning'
                ? 'bg-amber-400'
                : toastMessage.type === 'info'
                ? 'bg-blue-400'
                : 'bg-emerald-400'
            }`}
          />
          <p className="text-xs font-medium text-slate-200">{toastMessage.text}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-slate-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
