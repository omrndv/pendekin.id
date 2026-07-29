<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>500 — Kesalahan Server | Pendekin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #050505;
            --text-main: #f9fafb;
            --text-muted: #9ca3af;
            --accent-1: #3b82f6;
            --accent-2: #8b5cf6;
            --accent-3: #10b981;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        body { 
            background-color: var(--bg-color); 
            color: var(--text-main); 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            padding: 1.5rem; 
            position: relative; 
            overflow: hidden; 
        }
        
        /* Background Animations */
        .ambient-light {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            opacity: 0.4;
            animation: float 10s infinite ease-in-out alternate;
            z-index: 0;
        }
        .light-1 {
            width: 400px; height: 400px;
            background: rgba(59, 130, 246, 0.4);
            top: -10%; left: -10%;
            animation-delay: 0s;
        }
        .light-2 {
            width: 500px; height: 500px;
            background: rgba(139, 92, 246, 0.3);
            bottom: -20%; right: -10%;
            animation-delay: -5s;
        }
        .light-3 {
            width: 300px; height: 300px;
            background: rgba(16, 185, 129, 0.2);
            top: 40%; left: 60%;
            animation-duration: 15s;
        }

        @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            100% { transform: translate(30px, 50px) scale(1.1); }
        }

        .grid-bg {
            position: absolute;
            inset: 0;
            background-image: 
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
            -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
            z-index: 1;
        }

        .container {
            position: relative;
            z-index: 10;
            max-width: 600px;
            width: 100%;
            text-align: center;
            animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(20px);
        }

        @keyframes fadeUp {
            to { opacity: 1; transform: translateY(0); }
        }

        .error-code {
            font-size: clamp(6rem, 15vw, 9rem);
            font-weight: 800;
            line-height: 1;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #fff 20%, rgba(255,255,255,0.3) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.05em;
            position: relative;
            display: inline-block;
        }

        .error-code::after {
            content: '500';
            position: absolute;
            left: 0; top: 0;
            background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: blur(20px);
            opacity: 0.5;
            z-index: -1;
        }

        .title {
            font-size: clamp(1.5rem, 4vw, 2.25rem);
            font-weight: 700;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
        }

        .desc {
            font-size: 1rem;
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 2.5rem;
            max-width: 480px;
            margin-inline: auto;
        }

        .actions {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.875rem 1.75rem;
            border-radius: 999px;
            font-size: 0.95rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: #fff;
            color: #000;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);
        }

        .btn-primary:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 8px 25px rgba(255, 255, 255, 0.25);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }

        .icon {
            width: 18px;
            height: 18px;
        }
    </style>
</head>
<body>
    <div class="ambient-light light-1"></div>
    <div class="ambient-light light-2"></div>
    <div class="ambient-light light-3"></div>
    <div class="grid-bg"></div>
    
    <div class="container">
        <div class="error-code">500</div>
        <h1 class="title">Kesalahan Server</h1>
        <p class="desc">Terjadi kesalahan pada sistem kami. Tim engineer kami telah diberitahu dan sedang memperbaikinya. Silakan coba lagi beberapa saat lagi.</p>
        
        <div class="actions">
            <a href="/" class="btn btn-primary">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Beranda Utama
            </a>
            <a href="/dashboard" class="btn btn-secondary">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M9 21V9"></path></svg>
                Dashboard
            </a>
        </div>
    </div>
</body>
</html>
