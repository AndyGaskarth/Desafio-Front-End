import { test, expect } from '@playwright/test'

test('catalogue search and NFT details', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Encontre sua criatura cósmica' })).toBeVisible()
  await page.getByPlaceholder('Nome ou criador').fill('Pietro')
  await expect(page.getByText('Cosmic Creature #01')).toBeVisible()
  await page.getByText('Cosmic Creature #01').click()
  await expect(page.getByRole('heading', { name: 'Cosmic Creature #01' })).toBeVisible()
})

test('account wallet management', async ({ page }) => {
  await page.goto('/account')
  await page.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Colecionador Demo' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Colecionador Demo' })).toBeVisible()
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click()
  await expect(page.getByText('Nova carteira')).toBeVisible()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Excluir carteira Nova carteira' }).click()
  await expect(page.getByText('Nova carteira')).toHaveCount(0)
})

test('cart, account and checkout flow', async ({ page }) => {
  await page.goto('/nft/1')
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await page.goto('/cart')
  await expect(page.getByText('Cosmic Creature #01')).toBeVisible()
  await page.getByLabel('Cupom').fill('NEXUS10')
  await page.getByLabel('Cupom').press('Enter')
  await expect(page.getByText('10% de desconto aplicado')).toBeVisible()
  await page.goto('/account')
  await page.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
  await page.goto('/checkout')
  await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()
})
