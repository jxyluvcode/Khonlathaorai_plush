'use client';

import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Person, Item, Charges, PersonSummary } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';

interface BillSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    persons: Person[];
    items: Item[];
    charges: Charges;
    summary: PersonSummary[];
}

/**
 * BillSummaryModal - แสดงบิลสรุปผลแบบละเอียด พร้อม Export เป็น PNG
 */
export function BillSummaryModal({
    isOpen,
    onClose,
    persons,
    items,
    charges,
    summary,
}: BillSummaryModalProps) {
    const billRef = useRef<HTMLDivElement>(null);

    // Debug: ตรวจสอบข้อมูล
    console.log('Summary data:', summary);
    console.log('Persons data:', persons);

    // คำนวณยอดรวมทั้งหมด
    const grandTotal = summary.reduce((sum, person) => sum + person.total, 0);
    const totalSubtotal = summary.reduce((sum, person) => sum + person.subtotal, 0);
    const totalServiceCharge = summary.reduce((sum, person) => sum + person.serviceCharge, 0);
    const totalTax = summary.reduce((sum, person) => sum + person.tax, 0);

    // ฟังก์ชัน Export เป็น PNG
    const handleExportPNG = async () => {
        if (!billRef.current) {
            toast.error('ไม่พบเนื้อหาที่จะ export');
            return;
        }

        const toastId = toast.loading('กำลังสร้างรูปภาพ...');

        try {
            // รอให้ fonts โหลดเสร็จ
            await document.fonts.ready;

            // รอสักครู่ให้ render เสร็จ
            await new Promise(resolve => setTimeout(resolve, 300));

            // บันทึกความสูงเดิม
            const originalHeight = billRef.current.style.height;
            
            // กำหนดความสูงให้พอดีกับเนื้อหา
            billRef.current.style.height = 'auto';

            // รอให้ re-render
            await new Promise(resolve => setTimeout(resolve, 100));

            // ใช้ html-to-image แปลงเป็น PNG
            const dataUrl = await toPng(billRef.current, {
                quality: 0.95,
                // pixelRatio: 1,
                backgroundColor: '#ffffff',
                cacheBust: true,
                width: billRef.current.scrollWidth,
                height: billRef.current.scrollHeight,
                style: {
                    margin: '0',
                    padding: '40px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }
            });

            // คืนค่าความสูงเดิม
            billRef.current.style.height = originalHeight;

            // แปลง dataUrl เป็น Blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            // สร้าง download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            link.download = `bill-summary-${date}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // ทำความสะอาด
            setTimeout(() => URL.revokeObjectURL(url), 100);
            toast.success('ดาวน์โหลดบิลสำเร็จ', { id: toastId });
        } catch (error) {
            console.error('Export error:', error);
            toast.error('เกิดข้อผิดพลาด: ' + (error instanceof Error ? error.message : 'Unknown error'), { id: toastId });
        }
    };

    // หา items ของแต่ละคน
    const getPersonItems = (personId: string) => {
        return items.filter(item => item.sharedBy.includes(personId));
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} >
            <ModalContent size="4xl" closeButton className="!bg-background !text-foreground">
                <ModalHeader title="บิลสรุปผล" description="รายละเอียดการแบ่งค่าอาหารทั้งหมด" />

                <ModalBody className="overflow-y-auto !bg-muted">

                    {/* เนื้อหาที่จะ Export */}
                    <div
                        ref={billRef}
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '2rem',
                            borderRadius: '1rem',
                            fontFamily: 'Prompt, sans-serif',
                            color: '#111827',
                            minHeight: 'auto',
                            width: '100%'
                        }}
                    >
                        {/* Header */}
                        <div style={{ textAlign: 'center', borderBottom: '2px solid #1f2937', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>คนละเท่าไหร่ +</h1>
                            <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>บิลสรุปการแบ่งค่าอาหาร</p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                {new Date().toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        {/* รายการอาหารทั้งหมด */}
                        <div style={{ marginTop: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                                รายการอาหารทั้งหมด
                            </h2>
                            <div>
                                {items.map((item, index) => {
                                    const sharedPersons = item.sharedBy
                                        .map(id => persons.find(p => p.id === id)?.name)
                                        .filter(Boolean);
                                    const pricePerPerson = item.price / item.sharedBy.length;

                                    return (
                                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{index + 1}.</span>
                                                    <span style={{ fontWeight: '500', color: '#111827' }}>{item.name}</span>
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.25rem', marginLeft: '1.25rem' }}>
                                                    แบ่งกัน: {sharedPersons.join(', ')} ({item.sharedBy.length} คน)
                                                    <span style={{ marginLeft: '0.5rem' }}>
                                                        คนละ {formatCurrency(pricePerPerson)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span style={{ fontWeight: '600', color: '#111827', whiteSpace: 'nowrap' }}>
                                                {formatCurrency(item.price)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ค่าบริการและภาษี */}
                        {(charges.serviceCharge > 0 || charges.tax > 0) && (
                            <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginTop: '1.5rem' }}>
                                <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>ค่าบริการและภาษี</h3>
                                {charges.serviceCharge > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                        <span style={{ color: '#4b5563' }}>Service Charge:</span>
                                        <span style={{ color: '#111827' }}>{charges.serviceCharge}%</span>
                                    </div>
                                )}
                                {charges.tax > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                        <span style={{ color: '#4b5563' }}>Tax:</span>
                                        <span style={{ color: '#111827' }}>{charges.tax}%</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* สรุปยอดของแต่ละคน */}
                        <div style={{ marginTop: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                                สรุปยอดของแต่ละคน
                            </h2>
                            {summary.map((person) => {
                                const personItems = getPersonItems(person.personId);

                                return (
                                    <div key={person.personId} style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.75rem' }}>{person.personName}</h3>

                                        {/* รายการที่แบ่ง */}
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>รายการที่แบ่ง:</p>
                                            {personItems.map((item) => {
                                                const pricePerPerson = item.price / item.sharedBy.length;
                                                return (
                                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginLeft: '1rem', marginBottom: '0.25rem' }}>
                                                        <span style={{ color: '#4b5563' }}>
                                                            • {item.name} ({item.sharedBy.length} คน)
                                                        </span>
                                                        <span style={{ color: '#111827' }}>{formatCurrency(pricePerPerson)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* สรุปยอด */}
                                        <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #d1d5db' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                <span style={{ color: '#4b5563' }}>ราคารวม:</span>
                                                <span style={{ color: '#111827' }}>{formatCurrency(person.subtotal)}</span>
                                            </div>
                                            {person.serviceCharge > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                    <span style={{ color: '#4b5563' }}>Service Charge:</span>
                                                    <span style={{ color: '#111827' }}>{formatCurrency(person.serviceCharge)}</span>
                                                </div>
                                            )}
                                            {person.tax > 0 && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                    <span style={{ color: '#4b5563' }}>Tax:</span>
                                                    <span style={{ color: '#111827' }}>{formatCurrency(person.tax)}</span>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.125rem', paddingTop: '0.5rem', borderTop: '1px solid #9ca3af', marginTop: '0.5rem' }}>
                                                <span style={{ color: '#111827' }}>ยอดที่ต้องจ่าย:</span>
                                                <span style={{ color: '#2563eb' }}>{formatCurrency(person.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ยอดรวมทั้งหมด */}
                        <div style={{ backgroundColor: '#111827', color: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>ยอดรวมทั้งหมด</h2>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span>ราคารวม:</span>
                                    <span style={{ fontWeight: '600' }}>{formatCurrency(totalSubtotal)}</span>
                                </div>
                                {totalServiceCharge > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span>Service Charge:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(totalServiceCharge)}</span>
                                    </div>
                                )}
                                {totalTax > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span>Tax:</span>
                                        <span style={{ fontWeight: '600' }}>{formatCurrency(totalTax)}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', paddingTop: '0.5rem', borderTop: '1px solid #4b5563', marginTop: '0.5rem' }}>
                                    <span>ยอดรวมสุทธิ:</span>
                                    <span style={{ color: '#fbbf24' }}>{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', marginTop: '1.5rem' }}>
                            <p style={{ marginBottom: '0.25rem' }}>สร้างโดย คนละเท่าไหร่ +</p>
                            <p>ขอบคุณที่ใช้บริการ</p>
                        </div>
                    </div>

                </ModalBody>

                {/* ปุ่มควบคุม */}
                <ModalFooter>
                    <Button variant="outline" onPress={onClose}>
                        ปิด
                    </Button>
                    <Button onPress={handleExportPNG} className="gap-2">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        ดาวน์โหลดเป็น PNG
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
