import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get('size') || '192');
  
  // SVG com o logo do CuidaAI
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#1c70f2" rx="${size * 0.1}"/>
      
      <!-- Coração estilizado representando cuidado -->
      <g transform="translate(${size/2}, ${size/2})">
        <path d="M 0,-${size * 0.15}
                 C -${size * 0.1},-${size * 0.25} -${size * 0.25},-${size * 0.25} -${size * 0.25},-${size * 0.1}
                 C -${size * 0.25},0 -${size * 0.2},${size * 0.1} 0,${size * 0.25}
                 C ${size * 0.2},${size * 0.1} ${size * 0.25},0 ${size * 0.25},-${size * 0.1}
                 C ${size * 0.25},-${size * 0.25} ${size * 0.1},-${size * 0.25} 0,-${size * 0.15} Z"
              fill="white" opacity="0.9"/>
        
        <!-- Texto AI dentro do coração -->
        <text x="0" y="${size * 0.05}" 
              font-family="Arial, sans-serif" 
              font-size="${size * 0.15}" 
              font-weight="bold" 
              text-anchor="middle" 
              fill="#1c70f2">AI</text>
      </g>
      
      <!-- Texto CuidaAI embaixo -->
      <text x="${size/2}" y="${size * 0.85}" 
            font-family="Arial, sans-serif" 
            font-size="${size * 0.08}" 
            text-anchor="middle" 
            fill="white">CuidaAI</text>
    </svg>
  `;

  // Converter SVG para base64
  const base64 = Buffer.from(svg).toString('base64');
  const dataUri = `data:image/svg+xml;base64,${base64}`;

  // Retornar como imagem SVG
  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}