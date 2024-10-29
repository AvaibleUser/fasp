-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('ACTIVO', 'INACTIVO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "EstadoCuenta" AS ENUM ('ACTIVA', 'INACTIVA', 'BLOQUEADA');

-- CreateEnum
CREATE TYPE "EstadoTransaccion" AS ENUM ('EXITOSA', 'FALLIDA', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "TipoCuenta" AS ENUM ('BANCARIA', 'TARJETA_CREDITO');

-- CreateEnum
CREATE TYPE "TipoEntidadFinanciera" AS ENUM ('BANCO', 'TARJETA_CREDITO');

-- CreateEnum
CREATE TYPE "TipoTransaccion" AS ENUM ('PAGO', 'RETIRO', 'TRANSFERENCIA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estado" "EstadoUsuario" NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuenta" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoCuenta" NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" "EstadoCuenta" NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entidadFinancieraId" INTEGER NOT NULL,

    CONSTRAINT "Cuenta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntidadFinanciera" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoEntidadFinanciera" NOT NULL,

    CONSTRAINT "EntidadFinanciera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaccion" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoTransaccion" NOT NULL,
    "descripcion" TEXT,
    "monto" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoTransaccion" NOT NULL,
    "errores" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cuentaOrigenId" INTEGER NOT NULL,
    "cuentaDestinoId" INTEGER,

    CONSTRAINT "Transaccion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cuenta_entidadFinancieraId_key" ON "Cuenta"("entidadFinancieraId");

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuenta" ADD CONSTRAINT "Cuenta_entidadFinancieraId_fkey" FOREIGN KEY ("entidadFinancieraId") REFERENCES "EntidadFinanciera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_cuentaOrigenId_fkey" FOREIGN KEY ("cuentaOrigenId") REFERENCES "Cuenta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaccion" ADD CONSTRAINT "Transaccion_cuentaDestinoId_fkey" FOREIGN KEY ("cuentaDestinoId") REFERENCES "Cuenta"("id") ON DELETE SET NULL ON UPDATE CASCADE;
