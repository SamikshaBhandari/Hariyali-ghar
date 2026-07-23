import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12 font-sans">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-7">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-600">
                    <CheckCircle size={30} className="stroke-[1.5]" />
                </div>

                <h1 className="text-xl font-extrabold text-slate-800 mb-2">
                    Order Placed Successfully!
                </h1>

                <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed mb-4">
                    Thank you! Your eSewa payment was successfully verified and your plants are on their way.
                </p>

                {orderId && (
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                        <span className="font-semibold text-slate-500">Order ID</span>
                        <span className="font-mono font-bold text-slate-800">{orderId}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-full border border-green-600 bg-green-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-green-700"
                    >
                        Go to Home
                    </button>
                    <button
                        onClick={() => navigate('/plants')}
                        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        Shop More Plants
                    </button>
                </div>
            </div>
        </div>
    );
}